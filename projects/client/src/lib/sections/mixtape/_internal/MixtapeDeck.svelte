<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import SwipeHandIcon from "$lib/components/icons/SwipeHandIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { portalToBody } from "$lib/utils/actions/portalToBody.ts";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { onDestroy } from "svelte";
  import MixtapeDone from "./MixtapeDone.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import MixtapeSwipeCard from "./MixtapeSwipeCard.svelte";
  import { SWIPE_COMMIT_DISTANCE } from "./SWIPE_COMMIT_DISTANCE.ts";
  import { toHintParts } from "./toHintParts.ts";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";

  const SLOT_COUNT = 3;
  const LEAVE_DURATION = 260;
  const TOAST_DURATION = 2200;
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
    rounds,
    savedTo,
    onKeep,
    onMoved,
  }: Omit<MixtapeResultsProps, "isLoading" | "onUndo"> = $props();

  let dx = $state(0);
  let dragStart = $state<number | null>(null);
  let hasMoved = false;
  let leaving = $state<"left" | "right" | null>(null);
  let isFlipped = $state(false);
  let isHintSeen = $state(safeLocalStorage.getItem(HINT_SEEN_KEY) === "true");
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;
  let toast = $state<{ title: string; left: number } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    clearTimeout(leaveTimer);
    clearTimeout(toastTimer);
  });

  const round = $derived(rounds.at(-1) ?? []);
  const position = $derived(round.length);
  const isFirstRound = $derived(rounds.length <= 1);
  const keptSoFar = $derived(rounds.flat().length);
  const current = $derived(slots.at(position));
  const next = $derived(slots.at(position + 1));
  const isDone = $derived(position >= SLOT_COUNT || current == null);
  const isHinting = $derived(!isHintSeen && position === 0 && !isDone);
  const strength = $derived(Math.min(Math.abs(dx) / SWIPE_COMMIT_DISTANCE, 1));

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

  const showToast = (title: string, left: number) => {
    clearTimeout(toastTimer);
    toast = left > 0 ? { title, left } : null;
    if (!toast) return;
    toastTimer = setTimeout(() => (toast = null), TOAST_DURATION);
  };

  const commit = (direction: "left" | "right") => {
    const slot = current;
    if (!slot || leaving) return;

    markHintSeen();
    leaving = direction;

    leaveTimer = setTimeout(() => {
      leaving = null;
      dx = 0;
      isFlipped = false;

      if (direction === "right") {
        onResult("watchlist", position + 1);
        showToast(slot.media.title, SLOT_COUNT - position - 1);
        onKeep(slot.media);
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
      {rounds}
      {picked}
      {savedTo}
      {closeHref}
      {changeHref}
      {startOverHref}
      onMore={slots.length > 0 ? showMore : null}
      {onMoved}
    />
  {:else if current}
    <div class="deck-layout">
      <header class="deck-header">
        <div class="deck-heading">
          <h2 class="ellipsis">
            {SLOT_COUNT - position === 1
              ? m.header_mixtape_find_last()
              : isFirstRound
                ? m.header_mixtape_find({ total: SLOT_COUNT })
                : m.header_mixtape_find_more({ total: SLOT_COUNT })}
          </h2>
          <p class="small secondary">
            <b class="deck-count">
              {isFirstRound
                ? m.text_mixtape_kept({ kept: position, total: SLOT_COUNT })
                : m.text_mixtape_round_kept({
                    kept: position,
                    total: SLOT_COUNT,
                    sofar: keptSoFar,
                  })}
            </b>
          </p>
        </div>
        <ol class="deck-slots" aria-hidden="true">
          {#each Array.from({ length: SLOT_COUNT }, (_, index) => index) as index (index)}
            {@const keptMedia = round.at(index)}
            <li
              class="deck-slot"
              class:is-kept={keptMedia != null}
              class:is-next={index === position}
            >
              {#if keptMedia}
                <CrossOriginImage src={keptMedia.poster.url.thumb} alt="" />
              {:else}
                <BookmarkIcon state="missing" />
              {/if}
            </li>
          {/each}
        </ol>
        <Link href={closeHref} color="inherit" label={m.button_label_close()}>
          <span class="deck-ghost"><CloseIcon /></span>
        </Link>
      </header>

      <div class="deck-stage">
        {#if toast}
          <p class="deck-toast" role="status">
            {m.text_mixtape_kept_toast({ title: toast.title, left: toast.left })}
          </p>
        {/if}
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
            {m.button_text_mixtape_another()}
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
            onclick={() => commit("right")}
          >
            <BookmarkIcon state="added" size="normal" />
          </button>
          <span class="deck-label is-keep">{m.button_text_mixtape_keep()}</span>
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
    gap: var(--ni-2);
    flex: 1;
    min-width: 0;

    h2,
    p {
      margin: 0;
    }
  }

  .deck-count {
    color: var(--color-text-primary);
  }

  .deck-slots {
    display: flex;
    gap: var(--ni-6);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .deck-slot {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    width: var(--ni-30);
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border: var(--border-thickness-xs) dashed
      color-mix(in srgb, var(--purple-400) 70%, transparent);
    border-radius: var(--border-radius-xs);
    color: color-mix(in srgb, var(--purple-300) 80%, transparent);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.is-next {
      border-color: var(--purple-300);
      box-shadow: 0 0 0 var(--ni-3)
        color-mix(in srgb, var(--purple-500) 35%, transparent);
    }

    &.is-kept {
      border-style: solid;
      border-color: var(--purple-400);
    }
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

  .deck-toast {
    position: absolute;
    inset-block-start: var(--gap-xs);
    inset-inline-start: 50%;
    z-index: var(--layer-raised);
    transform: translateX(-50%);

    max-width: calc(100% - var(--gap-m));
    margin: 0;
    padding: var(--ni-6) var(--ni-12);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    box-shadow: var(--shadow-floating);
    color: var(--purple-50);
    font-size: var(--font-size-text-small);
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    animation: deck-toast-in var(--transition-increment) ease-out;
  }

  @keyframes deck-toast-in {
    from {
      opacity: 0;
      transform: translate(-50%, calc(-1 * var(--ni-8)));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .deck-toast {
      animation: none;
    }
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

    &.secondary {
      color: var(--color-text-secondary);
    }

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
      width: var(--ni-48);
      height: var(--ni-48);

      background: var(--color-card-background);
      color: var(--color-text-secondary);

      :global(svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }

    &.is-keep {
      width: var(--ni-72);
      height: var(--ni-72);

      background: var(--purple-500);
      color: var(--purple-50);

      :global(svg) {
        width: var(--ni-28);
        height: var(--ni-28);
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
