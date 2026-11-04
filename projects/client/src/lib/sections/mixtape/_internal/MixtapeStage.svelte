<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import SwapIcon from "$lib/components/icons/SwapIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import MixtapeFinale from "./MixtapeFinale.svelte";
  import MixtapeGoalSlots from "./MixtapeGoalSlots.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import MixtapeStageCard from "./MixtapeStageCard.svelte";
  import MixtapeStageDetails from "./MixtapeStageDetails.svelte";
  import { MIXTAPE_SLOT_COUNT } from "./MIXTAPE_SLOT_COUNT.ts";
  import { toCarouselOffset } from "./toCarouselOffset.ts";

  const SWAP_DURATION = 180;
  const ADVANCE_DELAY = 420;
  const TOAST_DURATION = time.seconds(6);
  const SWIPE_DISTANCE = 56;
  const TAP_TOLERANCE = 6;

  const {
    slots,
    canSwap,
    picked,
    titleOf,
    closeHref,
    changeHref,
    startOverHref,
    onSkip,
    onUndo,
    onMore,
    onResult,
    rounds,
    savedTo,
    onKeep,
    onMoved,
    matchOf,
    becauseOf,
  }: Omit<MixtapeResultsProps, "isLoading"> = $props();

  let selected = $state(0);
  let keeping = $state<ReadonlyArray<number>>([]);
  let swapping = $state<number | null>(null);
  let swapped = $state<{ index: number; title: string } | null>(null);
  let dragStart: number | null = null;
  let hasDragged = false;
  let swapTimer: ReturnType<typeof setTimeout> | undefined;
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  let advanceTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    clearTimeout(swapTimer);
    clearTimeout(toastTimer);
    clearTimeout(advanceTimer);
  });

  const round = $derived(rounds.at(-1) ?? []);
  const isFirstRound = $derived(rounds.length <= 1);
  const keptSoFar = $derived(rounds.flat().length);
  const left = $derived(MIXTAPE_SLOT_COUNT - round.length);
  const isDone = $derived(left <= 0 || slots.length === 0);
  const current = $derived(slots.at(selected) ?? slots.at(0));
  const isKept = (index: number) => {
    const id = slots.at(index)?.media.id;
    return (
      id != null &&
      (keeping.includes(id) || round.some((media) => media.id === id))
    );
  };
  const isSelectedKept = $derived(isKept(selected));
  const swappedIn = $derived(
    swapped ? (slots.at(swapped.index)?.media.title ?? null) : null,
  );
  const kicker = $derived.by(() => {
    const because = current ? titleOf(current.because) : null;
    return because ? m.text_mixtape_because({ title: because }) : null;
  });

  const goalTitle = $derived(
    left === 1
      ? m.header_mixtape_find_last()
      : isFirstRound
        ? m.header_mixtape_find({ total: MIXTAPE_SLOT_COUNT })
        : m.header_mixtape_find_more({ total: MIXTAPE_SLOT_COUNT }),
  );
  const goalSub = $derived(
    isFirstRound
      ? m.text_mixtape_kept({ kept: round.length, total: MIXTAPE_SLOT_COUNT })
      : m.text_mixtape_round_kept({
          kept: round.length,
          total: MIXTAPE_SLOT_COUNT,
          sofar: keptSoFar,
        }),
  );
  const keepLabel = $derived(
    isSelectedKept ? m.tag_mixtape_kept() : m.button_text_mixtape_keep(),
  );

  const select = (index: number) => {
    if (index === selected) return;
    selected = index;
    onResult("open", index + 1);
  };

  const step = (delta: number) => {
    if (slots.length === 0) return;
    select((selected + delta + slots.length) % slots.length);
  };

  const swap = (index: number) => {
    const slot = slots.at(index);
    if (!slot || swapping != null || !canSwap) return;

    selected = index;
    swapping = index;

    swapTimer = setTimeout(() => {
      swapping = null;
      swapped = { index, title: slot.media.title };
      onResult("skip", index + 1);
      onSkip(slot.media.id);

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => (swapped = null), TOAST_DURATION);
    }, SWAP_DURATION);
  };

  const keep = () => {
    if (!current || isSelectedKept) return;
    const { media } = current;
    onResult("watchlist", selected + 1);
    keeping = [...keeping, media.id];
    onKeep(media)
      .catch(() => undefined)
      .finally(() => {
        keeping = keeping.filter((id) => id !== media.id);
      });

    const nextOpen = slots.findIndex(
      (_, index) => index !== selected && !isKept(index),
    );
    if (nextOpen < 0) return;
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => select(nextOpen), ADVANCE_DELAY);
  };

  const findMore = () => {
    onMore(slots.map(({ media }) => media.id));
    selected = 0;
  };

  const undo = () => {
    clearTimeout(toastTimer);
    swapped = null;
    onUndo();
  };

  /*
    Touch moves between the cards with a horizontal swipe; the tap that
    follows a swipe is swallowed so the card under the finger stays put.
  */
  const readingSign = (target: EventTarget | null) =>
    target instanceof Element && getComputedStyle(target).direction === "rtl"
      ? -1
      : 1;

  const onpointerdown = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    dragStart = event.clientX;
    hasDragged = false;
  };

  const onpointermove = (event: PointerEvent) => {
    if (dragStart == null) return;
    if (Math.abs(event.clientX - dragStart) > TAP_TOLERANCE) hasDragged = true;
  };

  const onpointerup = (event: PointerEvent) => {
    if (dragStart == null) return;
    const dx = (event.clientX - dragStart) * readingSign(event.currentTarget);
    dragStart = null;
    if (dx <= -SWIPE_DISTANCE) return step(1);
    if (dx >= SWIPE_DISTANCE) return step(-1);
  };

  const onpointercancel = () => {
    dragStart = null;
  };

  const onclickcapture = (event: MouseEvent) => {
    if (!hasDragged) return;
    hasDragged = false;
    event.stopPropagation();
    event.preventDefault();
  };
</script>

<section class="trakt-mixtape-stage" class:is-done={isDone}>
  {#if current && !isDone}
    <div class="stage-backdrop" aria-hidden="true">
      {#key current.media.id}
        <CrossOriginImage src={current.media.cover.url.medium} alt="" />
      {/key}
    </div>
  {/if}
  <span class="stage-veil" aria-hidden="true"></span>

  {#if isDone}
    <MixtapeFinale
      {rounds}
      {picked}
      {savedTo}
      {closeHref}
      {changeHref}
      {startOverHref}
      onMore={slots.length > 0 ? findMore : null}
      {onMoved}
      {matchOf}
      {becauseOf}
    />
  {:else if current}
    <div class="stage-layout">
      <div class="stage-main">
        <header class="stage-goal">
          <h2 class="stage-goal-title">{goalTitle}</h2>
          <div class="stage-goal-meta">
            <MixtapeGoalSlots {round} total={MIXTAPE_SLOT_COUNT} />
            <p class="small secondary">{goalSub}</p>
          </div>
        </header>

        <div
          class="stage-carousel"
          role="group"
          aria-roledescription="carousel"
          aria-label={goalTitle}
          {onpointerdown}
          {onpointermove}
          {onpointerup}
          {onpointercancel}
          {onclickcapture}
        >
          {#each slots as slot, index (slot.media.id)}
            <MixtapeStageCard
              {slot}
              offset={toCarouselOffset({
                index,
                selected,
                count: slots.length,
              })}
              isSelected={index === selected}
              isSwapping={index === swapping}
              isKept={isKept(index)}
              {canSwap}
              onSelect={() => select(index)}
              onSwap={() => swap(index)}
            />
          {/each}
        </div>

        <div class="stage-nav">
          <button
            type="button"
            class="stage-nav-button"
            aria-label={m.button_label_carousel_previous()}
            onclick={() => step(-1)}
          >
            <CaretLeftIcon />
          </button>
          <ol class="stage-dots" aria-hidden="true">
            {#each slots as slot, index (slot.media.id)}
              <li
                class="stage-dot"
                class:is-current={index === selected}
                class:is-kept={isKept(index)}
              ></li>
            {/each}
          </ol>
          <button
            type="button"
            class="stage-nav-button"
            aria-label={m.button_label_carousel_next()}
            onclick={() => step(1)}
          >
            <CaretRightIcon />
          </button>
        </div>
      </div>

      <div class="stage-side">
        {#key current.media.id}
          <MixtapeStageDetails media={current.media} {kicker} />
        {/key}

        <div class="stage-footer">
          <div class="stage-actions">
            <Button
              color="purple"
              disabled={isSelectedKept}
              label={keepLabel}
              onclick={keep}
            >
              {keepLabel}
            </Button>
            <button
              type="button"
              class="stage-swap"
              title={m.button_text_mixtape_show_another()}
              aria-label={m.button_text_mixtape_show_another()}
              disabled={!canSwap || isSelectedKept}
              onclick={() => swap(selected)}
            >
              <SwapIcon />
            </button>
          </div>
          <p class="stage-togo">
            <span class="bold">{m.text_mixtape_more_to_go({ left })}</span>
            <span class="secondary">{m.text_mixtape_saved_as_you_go()}</span>
          </p>
        </div>
      </div>
    </div>
  {/if}

  {#if swapped && swappedIn}
    <div class="stage-toast" role="status">
      <span
        >{m.text_mixtape_swapped({ old: swapped.title, new: swappedIn })}</span
      >
      <button type="button" onclick={undo}>{m.button_text_undo()}</button>
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-stage {
    --stage-card-tilt: 4deg;
    --border-radius-mixtape-stage-card: var(--border-radius-xl);

    container: mixtape-stage / inline-size;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    margin-inline: var(--layout-distance-side);
    margin-block-end: var(--ni-40);

    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);

    /* The hairline the design asks for: a ring that fades out downwards. */
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: var(--layer-raised);
      padding: var(--border-thickness-xxs);

      border-radius: inherit;
      background: linear-gradient(
        180deg,
        var(--color-mixtape-stage-ring),
        transparent 75%
      );
      mask:
        linear-gradient(black 0 0) content-box,
        linear-gradient(black 0 0);
      mask-composite: exclude;
      pointer-events: none;
    }

    p,
    h2 {
      margin: 0;
    }
  }

  .stage-backdrop {
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    height: 70%;

    opacity: 0.55;
    filter: blur(var(--ni-28)) saturate(1.1);
    transform: scale(1.15);
    pointer-events: none;

    :global(img) {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      animation: stage-backdrop-in calc(3 * var(--transition-increment))
        ease-out both;
    }
  }

  .stage-veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-card-background) 35%, transparent) 0%,
      color-mix(in srgb, var(--color-card-background) 85%, transparent) 55%,
      var(--color-card-background) 80%
    );
    pointer-events: none;
  }

  .stage-layout {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ni-380);
    column-gap: var(--ni-40);
    box-sizing: border-box;
    padding-block: var(--ni-32);
    padding-inline: var(--ni-44) var(--ni-40);
  }

  .stage-main {
    container: mixtape-stage-main / inline-size;
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    min-width: 0;
  }

  .stage-goal {
    display: flex;
    align-items: center;
    gap: var(--ni-18);
    min-width: 0;
  }

  .stage-goal-title {
    font-size: var(--ni-30);
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .stage-goal-meta {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .stage-carousel {
    --width-mixtape-stage-card: min(var(--ni-280), 42cqi);
    --stage-card-step: calc(var(--width-mixtape-stage-card) * 0.77);

    position: relative;
    height: calc(var(--width-mixtape-stage-card) * 1.5 + var(--ni-24));
    touch-action: pan-y;
    user-select: none;
  }

  .stage-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);
  }

  .stage-nav-button {
    all: unset;
    display: grid;
    place-items: center;
    width: var(--ni-36);
    height: var(--ni-36);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    color: var(--color-text-primary);
    cursor: pointer;

    transition: background var(--transition-increment) ease-in-out;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
    }
  }

  .stage-dots {
    display: flex;
    align-items: center;
    gap: var(--ni-6);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .stage-dot {
    width: var(--ni-6);
    height: var(--ni-6);
    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 20%, transparent);

    transition:
      width calc(2 * var(--transition-increment)) ease-in-out,
      background calc(2 * var(--transition-increment)) ease-in-out;

    &.is-kept {
      background: color-mix(in srgb, var(--color-foreground) 50%, transparent);
    }

    &.is-current {
      width: var(--ni-18);
      background: var(--color-foreground);
    }
  }

  .stage-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--gap-m);
    min-width: 0;
  }

  .stage-footer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .stage-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    > :global(.trakt-button) {
      flex: 1;
    }
  }

  .stage-swap {
    all: unset;
    flex: none;
    display: grid;
    place-items: center;
    width: var(--ni-48);
    height: var(--ni-48);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    color: var(--color-text-primary);
    cursor: pointer;

    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-foreground) 14%,
          transparent
        );
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  .stage-togo {
    align-self: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-6);
    padding: var(--ni-6) var(--ni-14);

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    font-size: var(--font-size-text-small);
  }

  .stage-toast {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-end: var(--ni-28);
    transform: translateX(-50%);
    z-index: var(--layer-floating);

    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding-block: var(--ni-10);
    padding-inline-start: var(--ni-16);
    padding-inline-end: var(--ni-12);

    border-radius: var(--border-radius-pill);
    background: var(--shade-940);
    color: var(--shade-10);
    box-shadow: var(--shadow-floating);
    font-size: var(--font-size-text-small);
    white-space: nowrap;

    button {
      all: unset;
      padding: var(--ni-2) var(--ni-6);
      border-radius: var(--border-radius-pill);
      color: var(--purple-300);
      font-weight: 700;
      cursor: pointer;

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--purple-300);
      }
    }
  }

  @container mixtape-stage (width < 60rem) {
    .stage-layout {
      grid-template-columns: minmax(0, 1fr);
      row-gap: var(--gap-l);
      padding: var(--gap-l) var(--gap-m);
    }

    .stage-side {
      justify-content: flex-start;
    }
  }

  /*
    Phones: the stage runs edge to edge, the carousel is swiped, the details
    read on below it with a centred heading, and the verdict buttons float
    above the bottom navbar, where the thumbs are.
  */
  @include for-mobile {
    .trakt-mixtape-stage {
      --stage-card-tilt: 5deg;
      --border-radius-mixtape-stage-card: var(--border-radius-l);

      margin-inline: 0;
      margin-block-end: 0;
      border-radius: 0;
      background: none;

      &::after {
        display: none;
      }
    }

    .stage-veil {
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
        color-mix(in srgb, var(--color-background) 90%, transparent) 50%,
        var(--color-background) 70%
      );
    }

    .stage-layout {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding: var(--gap-s) var(--layout-distance-side)
        calc(var(--ni-104) + var(--gap-m));
    }

    .stage-goal {
      flex-direction: column;
      gap: var(--gap-xs);
      text-align: center;
    }

    .stage-goal-title {
      font-size: var(--ni-24);
    }

    .stage-carousel {
      --width-mixtape-stage-card: var(--ni-180);
      --stage-card-step: var(--ni-136);

      margin-inline: calc(-1 * var(--layout-distance-side));
    }

    .stage-nav-button {
      display: none;
    }

    .stage-side {
      align-items: stretch;
    }

    .stage-footer {
      position: fixed;
      inset-inline: var(--layout-distance-side);
      inset-block-end: calc(var(--mobile-navbar-height) + var(--gap-s));
      z-index: var(--layer-floating);

      flex-direction: column-reverse;
      gap: var(--gap-xs);
      box-sizing: border-box;
      padding: var(--gap-xs) var(--ni-16) var(--ni-12);

      border-radius: var(--border-radius-xxl);
      background:
        var(--background-navbar-entry),
        color-mix(in srgb, var(--color-background-navbar) 85%, transparent);
      backdrop-filter: blur(var(--ni-8));
      box-shadow: var(--shadow-navbar-entry), var(--shadow-floating);

      animation: stage-footer-in calc(3 * var(--transition-increment))
        cubic-bezier(0.34, 1.3, 0.5, 1) both;
    }

    .stage-togo {
      align-self: center;
      justify-content: center;
      padding: 0;
      background: none;
      text-align: center;

      .secondary {
        display: none;
      }
    }

    .stage-toast {
      position: fixed;
      inset-block-end: calc(
        var(--mobile-navbar-height) + var(--ni-104) + var(--gap-m)
      );
      max-width: calc(100% - 2 * var(--layout-distance-side));
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @keyframes stage-backdrop-in {
    from {
      opacity: 0;
    }
  }

  @keyframes stage-footer-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-24));
    }
  }
</style>
