<script lang="ts">
  import { shortcut } from "@svelte-put/shortcut";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import type { SwipeDirection } from "$lib/components/gestures/models/SwipeDirection";
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import GridIcon from "$lib/components/icons/GridIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { trapTabFocus } from "$lib/utils/actions/trapTabFocus.ts";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { onMount, tick, untrack } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import type { TodayCloseReason } from "../models/TodayCloseReason.ts";
  import type { TodayStoryFrame } from "../models/TodayStoryFrame.ts";
  import type { TodayStoryGroup } from "../models/TodayStoryGroup.ts";
  import { useTodaySeenStories } from "../useTodaySeenStories.ts";
  import { portalToBody } from "$lib/utils/actions/portalToBody.ts";
  import { NOTHING_SHOWN } from "./NOTHING_SHOWN.ts";
  import { recordShown } from "./recordShown.ts";
  import TodayStoryFrameContent from "./TodayStoryFrameContent.svelte";
  import type { TodayStoryTapZone } from "./TodayStoryTapZonesProps.ts";
  import type { TodayStoryViewerProps } from "./TodayStoryViewerProps.ts";
  import { toFrameMedia } from "./toFrameMedia.ts";
  import { toOpenState } from "./toOpenState.ts";

  const FRAME_DURATION = time.seconds(10);
  const FLIP_HINT_SEEN_KEY = "trakt-today-flip-hint-seen";
  const HOLD_THRESHOLD = time.seconds(0.3);
  const STORY_TRANSITION = 150;
  const SWIPE_DRAG_CAP = 0.25;
  const SWIPE_DIRECTIONS: SwipeDirection[] = ["left", "right"];

  const { groups: initialGroups, startKey, source, onClose }:
    TodayStoryViewerProps = $props();

  const groups = untrack(() => initialGroups);
  const { markSeen, seenStories } = useTodaySeenStories();
  const { track: trackOpen } = useTrack(AnalyticsEvent.TodayOpen);
  const { track: trackStory } = useTrack(AnalyticsEvent.TodayStory);
  const { track: trackClose } = useTrack(AnalyticsEvent.TodayClose);
  const { track: trackAction } = useTrack(AnalyticsEvent.TodayAction);

  const openedAt = Date.now();
  let viewed = NOTHING_SHOWN;
  let isTracking = false;

  let groupKey = $state(untrack(() => startKey));
  let frameIndex = $state(0);
  let dialog: HTMLDialogElement | undefined = $state();

  const groupIndex = $derived(
    Math.max(
      0,
      groups.findIndex((candidate) => candidate.key === groupKey),
    ),
  );
  const group = $derived(groups.at(groupIndex));
  const currentFrame = $derived(
    Math.max(0, Math.min(frameIndex, (group?.frames.length ?? 1) - 1)),
  );
  const frame = $derived(group?.frames.at(currentFrame));
  const title = $derived(
    group?.type === "title" ? group.story.media.title : m.text_today_for_you(),
  );
  const cover = $derived(frame ? toFrameMedia(frame).cover.url.medium : null);

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  const isTouch = useMedia(WellKnownMediaQuery.touch);
  let slideSign = $state(1);
  let swipeOffset = $state(0);

  const slideAway = (
    _node: Element,
    { from, to, duration }: { from: number; to: string; duration: number },
  ) => ({
    duration,
    easing: cubicOut,
    css: (t: number, u: number) =>
      `transform: translateX(calc(${from}px + ${to} * ${u})); opacity: ${t}`,
  });

  const transitionDuration = $derived($isReducedMotion ? 0 : STORY_TRANSITION);
  const slideIn = $derived({
    x: `${slideSign * 33}%`,
    duration: transitionDuration,
  });
  const slideOut = $derived({
    from: swipeOffset,
    to: `${-slideSign * 33}%`,
    duration: transitionDuration,
  });

  let isFlipped = $state(false);
  let isFlipHintSeen = $state(
    safeLocalStorage.getItem(FLIP_HINT_SEEN_KEY) === "true",
  );
  let isHeld = $state(false);
  let isPageHidden = $state(false);
  let isUsingAction = $state(false);
  let pressedAt = 0;
  let lastPressDuration = 0;
  let lastPointerType = "";

  const isPaused = $derived(
    isHeld || isPageHidden || isUsingAction || isFlipped,
  );

  const isHinting = $derived(!isFlipHintSeen && currentFrame === 0);

  const markFlipHintSeen = () => {
    if (isFlipHintSeen) return;
    isFlipHintSeen = true;
    safeLocalStorage.setItem(FLIP_HINT_SEEN_KEY, "true");
  };

  const toggleFlip = () => {
    isFlipped = !isFlipped;
    markFlipHintSeen();
  };

  const returnFocusAfterPointer = (event: MouseEvent) => {
    if (event.detail > 0) dialog?.focus({ preventScroll: true });
  };

  const keepKeyboardFocus = (
    { zone, event }: { zone: TodayStoryTapZone; event: MouseEvent },
  ) => {
    if (event.detail > 0) return;

    tick().then(() =>
      [
        ...(dialog?.querySelectorAll<HTMLElement>(`[data-zone="${zone}"]`) ??
          []),
      ]
        .at(-1)
        ?.focus(),
    );
  };

  const flipOnTap = (event: MouseEvent) => {
    const isMouse = event.detail > 0 && lastPointerType === "mouse";
    if (!isMouse) onTap(toggleFlip)(event);
  };

  const press = (event: PointerEvent) => {
    lastPointerType = event.pointerType;
    isHeld = true;
    pressedAt = Date.now();
  };

  const release = () => {
    if (!isHeld) return;
    isHeld = false;
    lastPressDuration = Date.now() - pressedAt;
  };

  const onTap = (move: () => void) => (event: MouseEvent) => {
    returnFocusAfterPointer(event);

    if (lastPressDuration > HOLD_THRESHOLD) {
      lastPressDuration = 0;
      return;
    }
    move();
  };

  const isInsideAction = (target: EventTarget | null) =>
    target instanceof Element &&
    target.closest(".frame-actions") != null;

  const resetFrameState = () => {
    isFlipped = false;
    isUsingAction = false;
  };

  const noteShown = (
    shownGroup: TodayStoryGroup,
    shownFrame: TodayStoryFrame | undefined,
  ) => {
    if (!shownFrame) return;

    viewed = recordShown(viewed, {
      groupKey: shownGroup.key,
      frameKey: shownFrame.key,
    });
  };

  const enterGroup = (entered: TodayStoryGroup) => {
    markSeen(entered.key);
    trackStory({ type: entered.type });
  };

  const finish = (reason: TodayCloseReason) => {
    if (!isTracking) return;

    isTracking = false;
    trackClose({
      reason,
      duration: Date.now() - openedAt,
      frames: viewed.frames.size,
      groups: viewed.groups.size,
    });
  };

  const closeViewer = (reason: TodayCloseReason) => {
    finish(reason);
    onClose();
  };

  const showFrame = (index: number) => {
    resetFrameState();
    frameIndex = index;
    if (group) noteShown(group, group.frames.at(index));
  };

  const showGroup = (index: number, frame: number) => {
    const shown = groups.at(index);
    if (!shown) return;

    resetFrameState();
    slideSign = (index >= groupIndex ? 1 : -1) * (isRtl() ? -1 : 1);
    groupKey = shown.key;
    frameIndex = frame;
    enterGroup(shown);
    noteShown(shown, shown.frames.at(frame));
  };

  const next = () => {
    if (!group) return;
    if (currentFrame < group.frames.length - 1) {
      showFrame(currentFrame + 1);
      return;
    }
    if (groupIndex < groups.length - 1) {
      showGroup(groupIndex + 1, 0);
      return;
    }
    closeViewer("end");
  };

  const previous = () => {
    if (currentFrame > 0) {
      showFrame(currentFrame - 1);
      return;
    }
    const previousGroup = groups.at(groupIndex - 1);
    if (groupIndex > 0 && previousGroup) {
      showGroup(groupIndex - 1, previousGroup.frames.length - 1);
    }
  };

  const tapZone = (zone: TodayStoryTapZone, event: MouseEvent) => {
    if (zone === "previous") onTap(previous)(event);
    if (zone === "next") onTap(next)(event);
    if (zone === "flip") flipOnTap(event);
    keepKeyboardFocus({ zone, event });
  };

  const nextGroup = (event: MouseEvent) => {
    returnFocusAfterPointer(event);
    if (groupIndex < groups.length - 1) showGroup(groupIndex + 1, 0);
  };

  const previousGroup = (event: MouseEvent) => {
    returnFocusAfterPointer(event);
    if (groupIndex > 0) showGroup(groupIndex - 1, 0);
  };

  const isRtl = () => document.dir === "rtl";

  const swipeGroup = (
    { direction }: { direction: SwipeDirection | "inactive" },
  ) => {
    const isTowardsStart = (direction === "right") !== isRtl();
    const target = isTowardsStart ? groupIndex - 1 : groupIndex + 1;
    if (target < 0 || target >= groups.length) return;

    const sign = direction === "right" ? 1 : -1;
    swipeOffset = sign * window.innerWidth * SWIPE_DRAG_CAP;
    showGroup(target, 0);
  };

  const keyTriggers = [
    { key: "ArrowRight", callback: () => (isRtl() ? previous() : next()) },
    { key: "ArrowLeft", callback: () => (isRtl() ? next() : previous()) },
  ];

  onMount(() => {
    if (group) {
      isTracking = true;
      trackOpen({
        source,
        state: toOpenState({ groups, seenStories: $seenStories }),
      });
      enterGroup(group);
      noteShown(group, frame);
    }

    const previouslyFocused = document.activeElement;

    if (typeof dialog?.show === "function") {
      dialog.show();
    } else {
      dialog?.setAttribute("open", "");
    }
    dialog?.focus();

    const onVisibilityChange = () => {
      isPageHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      finish("leave");
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  });
</script>

<svelte:window use:shortcut={{ trigger: keyTriggers }} />

<dialog
  bind:this={dialog}
  class="trakt-today-story-viewer"
  aria-label={title}
  aria-modal="true"
  tabindex="-1"
  style="--today-story-duration: {FRAME_DURATION}ms"
  onkeydown={(event) => event.key === "Escape" && closeViewer("close")}
  use:portalToBody
  use:trapTabFocus
>
  {#key group?.key}
    {#if cover}
      <div
        class="viewer-backdrop"
        in:fade={{ duration: transitionDuration }}
        out:fade={{ duration: transitionDuration }}
      >
        <CrossOriginImage src={cover} alt="" />
      </div>
    {/if}
  {/key}

  <div class="viewer-side">
    <ActionButton
      label={m.button_label_previous_story()}
      style="ghost"
      onclick={previousGroup}
      disabled={groupIndex === 0}
    >
      <CaretLeftIcon />
    </ActionButton>
  </div>

  <div
    class="viewer-card"
    onfocusin={(event) => (isUsingAction = isInsideAction(event.target))}
    onfocusout={() => (isUsingAction = false)}
  >
    <div class="viewer-progress">
      {#each group?.frames ?? [] as segment, index (segment.key)}
        <div class="viewer-segment" class:is-filled={index < currentFrame}>
          {#if index === currentFrame}
            <div
              class="segment-timer"
              class:is-paused={isPaused}
              onanimationend={next}
            ></div>
          {/if}
        </div>
      {/each}
    </div>

    <header class="viewer-header">
      <div class="viewer-title">
        <p class="bold ellipsis">{title}</p>
        <p class="small secondary">
          {m.text_today_story_position({
            current: groupIndex + 1,
            total: groups.length,
          })}
        </p>
      </div>
      <div class="viewer-details-button">
        <ActionButton
          label={m.button_label_poster_details()}
          style="ghost"
          onclick={toggleFlip}
        >
          <InfoIcon />
        </ActionButton>
      </div>
      <ActionButton
        label={m.button_label_view_all_today()}
        style="ghost"
        href={UrlBuilder.today()}
        onclick={() => frame && trackAction({ action: "view-all", frame: frame.type })}
      >
        <GridIcon />
      </ActionButton>
      <ActionButton
        label={m.button_label_close_stories()}
        style="ghost"
        onclick={() => closeViewer("close")}
      >
        <CloseIcon />
      </ActionButton>
    </header>

    <div class="viewer-stage" class:is-swipe-release={swipeOffset !== 0}>
      {#if $isTouch}
        <SwipeX
          classList="viewer-slides"
          directions={SWIPE_DIRECTIONS}
          onSwipe={swipeGroup}
        >
          {#snippet indicator()}{/snippet}
          {@render slides()}
        </SwipeX>
      {:else}
        <div class="viewer-slides">
          {@render slides()}
        </div>
      {/if}
    </div>
  </div>

  <div class="viewer-side">
    <ActionButton
      label={m.button_label_next_story()}
      style="ghost"
      onclick={nextGroup}
      disabled={groupIndex === groups.length - 1}
    >
      <CaretRightIcon />
    </ActionButton>
  </div>
</dialog>

{#snippet slides()}
  {#key group?.key}
    <div
      class="viewer-slide"
      in:fly={slideIn}
      out:slideAway={slideOut}
      onoutrostart={(event) => (event.currentTarget.inert = true)}
      onoutroend={() => (swipeOffset = 0)}
    >
      {#if frame}
        {#key frame.key}
          <TodayStoryFrameContent
            {frame}
            {isHinting}
            bind:isFlipped
            onTap={tapZone}
            onPressStart={press}
            onPressEnd={release}
          />
        {/key}
      {/if}
    </div>
  {/key}
{/snippet}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin floating-card {
    width: var(--ni-480);
    height: min(var(--ni-920), 92dvh);

    border-radius: var(--border-radius-xxl);
    box-shadow: var(--shadow-base);
  }

  .trakt-today-story-viewer {
    position: fixed;
    inset: 0;
    z-index: var(--layer-overlay);

    box-sizing: border-box;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;

    &:focus-visible {
      outline: none;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-l);

    background: var(--color-background);
    color: var(--color-text-primary);

    .viewer-backdrop {
      position: absolute;
      inset: 0;
      opacity: 0.35;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(var(--ni-24));
      }
    }

    .viewer-side {
      position: relative;

      @include for-tablet-sm-and-below {
        display: none;
      }
    }

    .viewer-card {
      position: relative;
      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      gap: var(--gap-m);

      width: 100%;
      height: 100%;
      padding-block: calc(var(--gap-s) + env(safe-area-inset-top, 0px))
        calc(var(--gap-l) + env(safe-area-inset-bottom, 0px));
      padding-inline: calc(
        var(--gap-m) +
          max(env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))
      );

      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
        color-mix(in srgb, var(--color-background) 10%, transparent) 30%,
        var(--color-background) 70%
      );

      @include for-tablet-lg {
        @include floating-card;
      }

      @include for-desktop {
        @include floating-card;
      }
    }

    .viewer-progress {
      display: flex;
      gap: var(--gap-xxs);
    }

    .viewer-segment {
      flex-grow: 1;
      height: var(--ni-3);

      border-radius: var(--border-radius-xs);
      background: color-mix(in srgb, var(--color-foreground) 25%, transparent);

      overflow: hidden;

      &.is-filled {
        background: var(--color-foreground);
      }
    }

    .segment-timer {
      height: 100%;
      background: var(--color-foreground);
      animation: today-story-timer var(--today-story-duration) linear forwards;

      &.is-paused {
        animation-play-state: paused;
      }
    }

    .viewer-header {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .viewer-details-button {
      display: none;

      @include for-touch {
        display: flex;
      }
    }

    .viewer-title {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .viewer-stage {
      position: relative;

      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-height: 0;

      :global(.viewer-slides) {
        display: grid;
        grid-template: minmax(0, 1fr) / minmax(0, 1fr);
        flex-grow: 1;
        min-height: 0;
      }

      &.is-swipe-release :global(.viewer-slides) {
        transition: none;
      }
    }

    .viewer-slide {
      grid-area: 1 / 1;

      display: flex;
      flex-direction: column;
      min-height: 0;
    }

  }

  @keyframes today-story-timer {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
</style>
