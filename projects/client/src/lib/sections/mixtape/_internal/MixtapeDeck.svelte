<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import SwipeHandIcon from "$lib/components/icons/SwipeHandIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist.ts";
  import { portalToBody } from "$lib/utils/actions/portalToBody.ts";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { onDestroy } from "svelte";
  import MixtapeDone from "./MixtapeDone.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import type { MixtapeSlot } from "./MixtapeSlot.ts";
  import MixtapeSwipeCard from "./MixtapeSwipeCard.svelte";
  import { SWIPE_COMMIT_DISTANCE } from "./SWIPE_COMMIT_DISTANCE.ts";
  import { toHintParts } from "./toHintParts.ts";
  import { toMediaStoreProps } from "./toMediaStoreProps.ts";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";

  const SLOT_COUNT = 3;
  const LEAVE_DURATION = 260;
  const TAP_TOLERANCE = 6;
  const HINT_SEEN_KEY = "trakt-mixtape-swipe-hint-seen";

  const {
    slots,
    picked,
    titleOf,
    closeHref,
    changeHref,
    startOverHref,
    onSkip,
    onMore,
    onResult,
  }: Omit<MixtapeResultsProps, "isLoading" | "onUndo"> = $props();

  let position = $state(0);
  let kept = $state<MixtapeSlot[]>([]);
  let dx = $state(0);
  let dragStart = $state<number | null>(null);
  let hasMoved = false;
  let leaving = $state<"left" | "right" | null>(null);
  let isFlipped = $state(false);
  let isHintSeen = $state(safeLocalStorage.getItem(HINT_SEEN_KEY) === "true");
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => clearTimeout(leaveTimer));

  const current = $derived(slots.at(position));
  const next = $derived(slots.at(position + 1));
  const isDone = $derived(position >= SLOT_COUNT || current == null);
  const isHinting = $derived(!isHintSeen && position === 0 && !isDone);
  const strength = $derived(Math.min(Math.abs(dx) / SWIPE_COMMIT_DISTANCE, 1));

  const watchlist = $derived(
    current
      ? useWatchlist({
          ...toMediaStoreProps(current.media),
          isToastEnabled: false,
        })
      : null,
  );

  const hintParts = $derived(
    toHintParts({
      format: m.text_mixtape_swipe_hint,
      right: m.text_mixtape_swipe_right(),
      left: m.text_mixtape_swipe_left(),
    }),
  );

  const markHintSeen = () => {
    if (isHintSeen) return;
    isHintSeen = true;
    safeLocalStorage.setItem(HINT_SEEN_KEY, "true");
  };

  const commit = (direction: "left" | "right") => {
    const slot = current;
    if (!slot || leaving) return;

    markHintSeen();
    leaving = direction;
    if (direction === "right") watchlist?.addToWatchlist();

    leaveTimer = setTimeout(() => {
      leaving = null;
      dx = 0;
      isFlipped = false;

      if (direction === "right") {
        kept = [...kept, slot];
        onResult("watchlist", position + 1);
        position += 1;
        return;
      }

      onResult("skip", position + 1);
      onSkip(slot.media.id);
    }, LEAVE_DURATION);
  };

  const flip = () => {
    markHintSeen();
    isFlipped = !isFlipped;
    if (isFlipped) onResult("open", position + 1);
  };

  const onpointerdown = (event: PointerEvent) => {
    if (leaving) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    markHintSeen();
    dragStart = event.clientX;
    hasMoved = false;
  };

  const onpointermove = (event: PointerEvent) => {
    if (dragStart == null) return;
    dx = event.clientX - dragStart;
    hasMoved = hasMoved || Math.abs(dx) > TAP_TOLERANCE;
  };

  const onpointerup = () => {
    if (dragStart == null) return;
    dragStart = null;

    if (dx > SWIPE_COMMIT_DISTANCE) return commit("right");
    if (dx < -SWIPE_COMMIT_DISTANCE) return commit("left");
    if (!hasMoved) flip();
    dx = 0;
  };

  const showMore = () => {
    onMore(slots.map(({ media }) => media.id));
    position = 0;
    kept = [];
  };
</script>

<div class="trakt-mixtape-deck" use:portalToBody>
  {#if current}
    <div class="deck-backdrop" aria-hidden="true">
      <CrossOriginImage src={current.media.cover.url.medium} alt="" />
    </div>
  {/if}

  {#if isDone}
    <MixtapeDone
      {kept}
      {picked}
      {closeHref}
      {changeHref}
      {startOverHref}
      onMore={slots.length > 0 ? showMore : null}
    />
  {:else if current}
    <div class="deck-layout">
      <div class="deck-progress">
        {#each Array.from({ length: SLOT_COUNT }, (_, index) => index) as index (index)}
          <div class="deck-segment" class:is-on={index <= position}></div>
        {/each}
      </div>

      <header class="deck-header">
        <div class="deck-heading">
          <p class="bold ellipsis">{m.header_mixtape_results()}</p>
          <p class="small secondary">
            {m.text_mixtape_position({
              position: String(position + 1),
              total: String(SLOT_COUNT),
            })}
          </p>
        </div>
        <button
          type="button"
          class="deck-ghost"
          aria-label={m.button_label_show_details()}
          onclick={flip}
        >
          <InfoIcon />
        </button>
        <Link href={closeHref} color="inherit" label={m.button_label_close()}>
          <span class="deck-ghost"><CloseIcon /></span>
        </Link>
      </header>

      <div class="deck-stage">
        <div
          class="deck-card-box"
          role="group"
          aria-label={current.media.title}
          {onpointerdown}
          {onpointermove}
          {onpointerup}
          onpointercancel={onpointerup}
        >
          {#if next}
            <div class="deck-behind" aria-hidden="true">
              <CrossOriginImage src={next.media.poster.url.medium} alt="" />
            </div>
          {/if}
          {#key current.media.id}
            <MixtapeSwipeCard
              slot={current}
              {dx}
              {leaving}
              isDragging={dragStart != null}
              {isFlipped}
              {isHinting}
            />
          {/key}
        </div>
      </div>

      {#if isHinting}
        <div class="deck-coach">
          <SwipeHandIcon />
          <span>
            {#each hintParts as part, index (index)}
              {#if part.isEmphasis}<b>{part.text}</b>{:else}{part.text}{/if}
            {/each}
          </span>
        </div>
      {/if}

      <div class="deck-text">
        {#if titleOf(current.because)}
          <p class="tag uppercase bold ellipsis deck-kicker">
            {m.text_mixtape_because({ title: titleOf(current.because) ?? "" })}
          </p>
        {/if}
        <h2 class="ellipsis">{current.media.title}</h2>
        <p class="small secondary">{toMixtapeMeta(current.media)}</p>
      </div>

      <div class="deck-actions">
        <div class="deck-action">
          <button
            type="button"
            class="deck-button is-skip"
            aria-label={m.button_label_mixtape_another()}
            style:--button-scale={dx < 0 ? 1 + strength * 0.2 : 1}
            onclick={() => commit("left")}
          >
            <CloseIcon />
          </button>
          <span class="deck-label secondary">
            {m.button_text_mixtape_not_this()}
          </span>
        </div>

        <div class="deck-swipe-hint" aria-hidden="true">
          <CaretLeftIcon />
          <span>{m.text_mixtape_or_swipe()}</span>
          <CaretRightIcon />
        </div>

        <div class="deck-action">
          <button
            type="button"
            class="deck-button is-keep"
            aria-label={m.button_text_watchlist()}
            style:--button-scale={dx > 0 ? 1 + strength * 0.2 : 1}
            style:--button-fill={`${dx > 0 ? Math.round(strength * 100) : 0}%`}
            class:is-filled={dx > 0 && strength > 0.5}
            onclick={() => commit("right")}
          >
            <BookmarkIcon state="added" size="normal" />
          </button>
          <span class="deck-label is-keep">{m.button_text_watchlist()}</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape-deck {
    position: fixed;
    inset: 0;
    z-index: var(--layer-overlay);

    overflow: hidden;
    background: var(--color-background);
    color: var(--color-text-primary);
  }

  .deck-backdrop {
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

  .deck-layout {
    position: relative;
    box-sizing: border-box;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    padding: var(--gap-s) var(--gap-m) var(--gap-l);
    padding-block-start: calc(var(--gap-s) + env(safe-area-inset-top));
    padding-block-end: calc(var(--gap-l) + env(safe-area-inset-bottom));

    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
      color-mix(in srgb, var(--color-background) 10%, transparent) 30%,
      var(--color-background) 70%
    );
  }

  .deck-progress {
    display: flex;
    gap: var(--gap-xxs);
  }

  .deck-segment {
    flex: 1;
    height: var(--ni-3);
    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--color-foreground) 25%, transparent);

    &.is-on {
      background: var(--color-foreground);
    }
  }

  .deck-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .deck-heading {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .deck-ghost {
    all: unset;
    display: grid;
    place-items: center;
    width: var(--ni-44);
    height: var(--ni-44);

    border-radius: 50%;
    color: var(--color-text-primary);
    cursor: pointer;

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
    }
  }

  .deck-stage {
    position: relative;
    flex: 1;
    min-height: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .deck-card-box {
    position: relative;
    height: 100%;
    max-height: var(--ni-520);
    aspect-ratio: 2 / 3;

    touch-action: none;
    user-select: none;
    cursor: grab;
  }

  .deck-behind {
    position: absolute;
    inset: 0;
    overflow: hidden;

    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-base);
    opacity: 0.55;
    transform: translateY(var(--ni-10)) scale(0.94);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .deck-coach {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
    padding: var(--ni-8) var(--ni-12);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--purple-500) 22%, transparent);
    color: var(--color-text-primary);
    font-size: var(--font-size-text-small);
    text-align: center;

    :global(svg) {
      flex: none;
    }
  }

  .deck-text {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-height: var(--ni-64);

    p,
    h2 {
      margin: 0;
    }
  }

  .deck-kicker {
    color: var(--color-text-emphasis);
  }

  .deck-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: var(--gap-m);
  }

  .deck-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);
  }

  .deck-label {
    font-size: var(--font-size-text-small);
    font-weight: 700;

    &.is-keep {
      color: var(--color-text-emphasis);
    }
  }

  .deck-button {
    all: unset;
    display: grid;
    place-items: center;
    width: var(--ni-56);
    height: var(--ni-56);

    border-radius: 50%;
    box-shadow: var(--shadow-floating);
    cursor: pointer;

    transform: scale(var(--button-scale, 1));
    transition: transform var(--transition-increment) ease-out;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
    }

    &.is-skip {
      background: var(--color-card-background);
      color: var(--color-text-primary);

      :global(svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }

    &.is-keep {
      width: var(--ni-64);
      height: var(--ni-64);

      background: color-mix(
        in srgb,
        var(--purple-500) var(--button-fill, 0%),
        var(--color-card-background)
      );
      box-shadow:
        inset 0 0 0 var(--border-thickness-xs) var(--purple-400),
        var(--shadow-floating);
      color: var(--purple-300);

      &.is-filled {
        color: var(--purple-50);
      }
    }
  }

  .deck-swipe-hint {
    display: flex;
    align-items: center;
    gap: var(--ni-6);

    color: var(--color-text-secondary);
    font-size: var(--font-size-text-small);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
