<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CassetteIcon from "$lib/components/icons/CassetteIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { portalToBody } from "$lib/utils/actions/portalToBody.ts";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { onDestroy } from "svelte";
  import MixtapeDone from "./MixtapeDone.svelte";
  import MixtapeGoalSlots from "./MixtapeGoalSlots.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import MixtapeSwipeCard from "./MixtapeSwipeCard.svelte";
  import { SWIPE_COMMIT_DISTANCE } from "./SWIPE_COMMIT_DISTANCE.ts";
  import { toMixtapeMeta } from "./toMixtapeMeta.ts";
  import { MIXTAPE_SLOT_COUNT } from "./MIXTAPE_SLOT_COUNT.ts";

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
  let leavingFor = $state<{ id: number; direction: "left" | "right" } | null>(
    null,
  );
  let hasEntered = $state(false);
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
  const isDone = $derived(position >= MIXTAPE_SLOT_COUNT || current == null);
  const leaving = $derived(
    leavingFor?.id === current?.media.id ? (leavingFor?.direction ?? null) : null,
  );
  const entrance = $derived(
    leavingFor && !leaving && !hasEntered ? leavingFor.direction : null,
  );
  const isSkipping = $derived(
    leaving === "left" ||
      entrance === "left" ||
      (dragStart != null && dx < 0),
  );
  const isHinting = $derived(!isHintSeen && position === 0 && !isDone);
  const strength = $derived(Math.min(Math.abs(dx) / SWIPE_COMMIT_DISTANCE, 1));

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
    leavingFor = { id: slot.media.id, direction };
    hasEntered = false;

    leaveTimer = setTimeout(() => {
      dx = 0;
      isFlipped = false;

      if (direction === "right") {
        onResult("watchlist", position + 1);
        showToast(slot.media.title, MIXTAPE_SLOT_COUNT - position - 1);
        onKeep(slot.media).finally(() => {
          if (current?.media.id === slot.media.id) leavingFor = null;
        });
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
            {MIXTAPE_SLOT_COUNT - position === 1
              ? m.header_mixtape_find_last()
              : isFirstRound
                ? m.header_mixtape_find({ total: MIXTAPE_SLOT_COUNT })
                : m.header_mixtape_find_more({ total: MIXTAPE_SLOT_COUNT })}
          </h2>
          <p class="small secondary">
            <b class="deck-count">
              {isFirstRound
                ? m.text_mixtape_kept({ kept: position, total: MIXTAPE_SLOT_COUNT })
                : m.text_mixtape_round_kept({
                    kept: position,
                    total: MIXTAPE_SLOT_COUNT,
                    sofar: keptSoFar,
                  })}
            </b>
          </p>
        </div>
        <MixtapeGoalSlots {round} total={MIXTAPE_SLOT_COUNT} />
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
          {#if next || isSkipping}
            <div
              class="deck-behind"
              class:is-skipping={isSkipping}
              aria-hidden="true"
            >
              {#if next}
                <CrossOriginImage src={next.media.poster.url.medium} alt="" />
              {/if}
              <div class="deck-mystery">
                <span class="deck-mystery-icon"><CassetteIcon /></span>
              </div>
            </div>
          {/if}
          {#key current.media.id}
            <div
              class="deck-card-enter"
              data-entrance={entrance}
              onanimationend={(event) => {
                if (event.target === event.currentTarget) hasEntered = true;
              }}
            >
              <MixtapeSwipeCard
                slot={current}
                {dx}
                {leaving}
                isDragging={dragStart != null}
                {isFlipped}
                {isHinting}
              />
            </div>
          {/key}
        </div>
      </div>

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
    transition:
      opacity var(--transition-increment) ease-out,
      transform calc(2 * var(--transition-increment))
        cubic-bezier(0.34, 1.56, 0.64, 1);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.is-skipping {
      opacity: 1;
      transform: translateY(var(--ni-6)) scale(0.97);

      .deck-mystery {
        opacity: 1;

        &::after {
          animation: deck-mystery-sweep calc(10 * var(--transition-increment))
            ease-in-out infinite;

          @media (prefers-reduced-motion: reduce) {
            animation: none;
          }
        }
      }

      .deck-mystery-icon {
        transform: scale(1);
      }
    }
  }

  .deck-mystery {
    position: absolute;
    inset: 0;

    display: grid;
    place-items: center;

    background:
      radial-gradient(
        120% 80% at 50% 0%,
        color-mix(in srgb, var(--purple-500) 55%, transparent),
        transparent 70%
      ),
      linear-gradient(160deg, var(--purple-800), var(--shade-940));
    opacity: 0;
    transition: opacity var(--transition-increment) ease-out;

    &::after {
      content: "";
      position: absolute;
      inset: 0;

      background: linear-gradient(
        105deg,
        transparent 35%,
        color-mix(in srgb, var(--shade-10) 18%, transparent) 50%,
        transparent 65%
      );
      transform: translateX(-100%);
    }
  }

  .deck-mystery-icon {
    display: flex;
    color: color-mix(in srgb, var(--shade-10) 85%, transparent);
    transform: scale(0.7);
    transition: transform calc(2 * var(--transition-increment))
      cubic-bezier(0.34, 1.56, 0.64, 1);

    :global(svg) {
      width: var(--ni-64);
      height: var(--ni-64);
    }
  }

  @keyframes deck-mystery-sweep {
    to {
      transform: translateX(100%);
    }
  }

  .deck-card-enter {
    position: absolute;
    inset: 0;

    &[data-entrance="right"] {
      animation: deck-card-advance calc(2 * var(--transition-increment))
        cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    &[data-entrance="left"] {
      animation: deck-card-swap calc(3 * var(--transition-increment))
        cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  @keyframes deck-card-advance {
    from {
      opacity: 0.55;
      transform: translateY(var(--ni-10)) scale(0.94);
    }
  }

  @keyframes deck-card-swap {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  .deck-kicker {
    color: var(--color-text-emphasis);
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
