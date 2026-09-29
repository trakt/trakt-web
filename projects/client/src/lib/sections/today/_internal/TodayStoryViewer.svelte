<script lang="ts">
  import { shortcut } from "@svelte-put/shortcut";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import GridIcon from "$lib/components/icons/GridIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { trapTabFocus } from "$lib/utils/actions/trapTabFocus.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { onMount, untrack } from "svelte";
  import { useTodaySeenStories } from "../useTodaySeenStories.ts";
  import { portalToBody } from "./portalToBody.ts";
  import TodayStoryFrameContent from "./TodayStoryFrameContent.svelte";
  import type { TodayStoryViewerProps } from "./TodayStoryViewerProps.ts";
  import { toFrameMedia } from "./toFrameMedia.ts";

  const FRAME_DURATION = time.seconds(10);
  const HOLD_THRESHOLD = time.seconds(0.3);

  const { groups, startKey, onClose }: TodayStoryViewerProps = $props();

  const { markSeen } = useTodaySeenStories();

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

  let isFlipped = $state(false);
  let isHeld = $state(false);
  let isPageHidden = $state(false);
  let isUsingAction = $state(false);
  let pressedAt = 0;
  let lastPressDuration = 0;

  const isPaused = $derived(
    isHeld || isPageHidden || isUsingAction || isFlipped,
  );

  const toggleFlip = () => {
    isFlipped = !isFlipped;
  };

  const isMouse = (event: MouseEvent) =>
    "pointerType" in event && event.pointerType === "mouse";

  const returnFocusAfterPointer = (event: MouseEvent) => {
    if (event.detail > 0) dialog?.focus({ preventScroll: true });
  };

  const flipOnTap = (event: MouseEvent) => {
    if (!isMouse(event)) onTap(toggleFlip)(event);
  };

  const press = () => {
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

  const showFrame = (index: number) => {
    resetFrameState();
    frameIndex = index;
  };

  const showGroup = (index: number, frame: number) => {
    const shown = groups.at(index);
    if (!shown) return;

    resetFrameState();
    groupKey = shown.key;
    frameIndex = frame;
    markSeen(shown.key);
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
    onClose();
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

  const nextGroup = (event: MouseEvent) => {
    returnFocusAfterPointer(event);
    if (groupIndex < groups.length - 1) showGroup(groupIndex + 1, 0);
  };

  const previousGroup = (event: MouseEvent) => {
    returnFocusAfterPointer(event);
    if (groupIndex > 0) showGroup(groupIndex - 1, 0);
  };

  const isRtl = () => document.dir === "rtl";

  const keyTriggers = [
    { key: "ArrowRight", callback: () => (isRtl() ? previous() : next()) },
    { key: "ArrowLeft", callback: () => (isRtl() ? next() : previous()) },
  ];

  onMount(() => {
    if (group) markSeen(group.key);

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
  onkeydown={(event) => event.key === "Escape" && onClose()}
  use:portalToBody
  use:trapTabFocus
>
  {#if cover}
    <div class="viewer-backdrop">
      <CrossOriginImage src={cover} alt="" />
    </div>
  {/if}

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
      <ActionButton
        label={m.button_label_view_all_today()}
        style="ghost"
        href={UrlBuilder.today()}
      >
        <GridIcon />
      </ActionButton>
      <ActionButton
        label={m.button_label_close_stories()}
        style="ghost"
        onclick={onClose}
      >
        <CloseIcon />
      </ActionButton>
    </header>

    <div class="viewer-stage">
      <button
        class="viewer-tap is-previous"
        aria-label={m.button_label_previous_story()}
        onclick={onTap(previous)}
        onpointerdown={press}
        onpointerup={release}
        onpointercancel={release}
        onpointerleave={release}
      ></button>
      <button
        class="viewer-tap is-flip"
        aria-label={isFlipped
          ? m.button_label_hide_details()
          : m.button_label_show_details()}
        aria-pressed={isFlipped}
        onclick={flipOnTap}
        onpointerdown={press}
        onpointerup={release}
        onpointercancel={release}
        onpointerleave={release}
      ></button>
      <button
        class="viewer-tap is-next"
        aria-label={m.button_label_next_story()}
        onclick={onTap(next)}
        onpointerdown={press}
        onpointerup={release}
        onpointercancel={release}
        onpointerleave={release}
      ></button>

      {#if frame}
        {#key frame.key}
          <TodayStoryFrameContent {frame} bind:isFlipped />
        {/key}
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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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

      @include for-tablet-lg-and-below {
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
      padding: var(--gap-s) var(--gap-m) var(--gap-l);

      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
        color-mix(in srgb, var(--color-background) 10%, transparent) 30%,
        var(--color-background) 70%
      );

      @include for-desktop {
        width: var(--ni-480);
        height: min(var(--ni-920), 92dvh);

        border-radius: var(--border-radius-xxl);
        box-shadow: var(--shadow-base);
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
      gap: var(--gap-m);
      flex-grow: 1;
      min-height: 0;
    }

    .viewer-tap {
      position: absolute;
      inset-block: 0;
      z-index: var(--layer-base);

      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;

      &.is-previous {
        inset-inline-start: 0;
        width: 25%;
      }

      &.is-flip {
        inset-inline-start: 25%;
        width: 50%;
      }

      &.is-next {
        inset-inline-end: 0;
        width: 25%;
      }
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
