<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import SwapIcon from "$lib/components/icons/SwapIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import TodayPosterDetails from "$lib/sections/today/TodayPosterDetails.svelte";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import MixtapeDoneWide from "./MixtapeDoneWide.svelte";
  import MixtapeFanPoster from "./MixtapeFanPoster.svelte";
  import MixtapeGoalSlots from "./MixtapeGoalSlots.svelte";
  import MixtapePicks from "./MixtapePicks.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import { MIXTAPE_SLOT_COUNT } from "./MIXTAPE_SLOT_COUNT.ts";

  const SWAP_DURATION = 180;
  const TOAST_DURATION = time.seconds(6);
  const PLACES = ["center", "start", "end"] as const;

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
  }: Omit<MixtapeResultsProps, "isLoading"> = $props();

  let selected = $state(0);
  let keeping = $state<ReadonlyArray<number>>([]);
  let isFinished = $state(false);
  let swapping = $state<number | null>(null);
  let swapped = $state<{ index: number; title: string } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  let swapTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    clearTimeout(swapTimer);
    clearTimeout(toastTimer);
  });

  const round = $derived(rounds.at(-1) ?? []);
  const isFirstRound = $derived(rounds.length <= 1);
  const keptSoFar = $derived(rounds.flat().length);
  const left = $derived(MIXTAPE_SLOT_COUNT - round.length);
  const isDone = $derived(isFinished || left <= 0 || slots.length === 0);
  const isKept = (index: number) => {
    const id = slots.at(index)?.media.id;
    return keeping.some((keptId) => keptId === id) ||
      round.some((media) => media.id === id);
  };
  const current = $derived(slots.at(selected) ?? slots.at(0));
  const isSelectedKept = $derived(isKept(selected));
  const swappedIn = $derived(
    swapped ? (slots.at(swapped.index)?.media.title ?? null) : null,
  );

  const select = (index: number) => {
    selected = index;
    onResult("open", index + 1);
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
    if (nextOpen >= 0) selected = nextOpen;
  };

  const findMore = () => {
    onMore(slots.map(({ media }) => media.id));
    isFinished = false;
    selected = 0;
  };

  const undo = () => {
    clearTimeout(toastTimer);
    swapped = null;
    onUndo();
  };
</script>

<div class="trakt-mixtape-fan">
  {#if current}
    <div class="fan-backdrop" aria-hidden="true">
      <CrossOriginImage src={current.media.cover.url.medium} alt="" />
    </div>
  {/if}

  {#if isDone}
    <div class="fan-done">
      <MixtapeDoneWide
        {rounds}
        {picked}
        {savedTo}
        {closeHref}
        {changeHref}
        {startOverHref}
        onMore={slots.length > 0 ? findMore : null}
        {onMoved}
        {matchOf}
      />
    </div>
  {:else}
    <div class="fan-layout">
      <header class="fan-header">
        <h2>
          {left === 1
            ? m.header_mixtape_find_last()
            : isFirstRound
              ? m.header_mixtape_find({ total: MIXTAPE_SLOT_COUNT })
              : m.header_mixtape_find_more({ total: MIXTAPE_SLOT_COUNT })}
        </h2>
        <MixtapeGoalSlots {round} total={MIXTAPE_SLOT_COUNT} />
        <p class="secondary">
          {isFirstRound
            ? m.text_mixtape_kept({ kept: round.length, total: MIXTAPE_SLOT_COUNT })
            : m.text_mixtape_round_kept({
                kept: round.length,
                total: MIXTAPE_SLOT_COUNT,
                sofar: keptSoFar,
              })}
        </p>
        <span class="fan-spacer"></span>
        <div class="fan-picks">
          <MixtapePicks {picked} --width-mixtape-pick="var(--ni-22)" />
        </div>
        <Button
          href={changeHref}
          variant="secondary"
          style="ghost"
          label={m.button_text_mixtape_change_picks()}
        >
          {m.button_text_mixtape_change_picks()}
        </Button>
        <Link href={closeHref} color="inherit" label={m.button_label_close()}>
          <span class="fan-close"><CloseIcon /></span>
        </Link>
      </header>

      <div class="fan-main">
        <div class="fan-stage">
          {#each slots as slot, index (slot.media.id)}
            <MixtapeFanPoster
              {slot}
              place={PLACES[index] ?? "center"}
              isSelected={index === selected}
              isSwapping={index === swapping}
              isKept={isKept(index)}
              {canSwap}
              onSelect={() => select(index)}
              onSwap={() => swap(index)}
            />
          {/each}
        </div>

        {#if current}
          <aside class="fan-panel" aria-label={m.button_label_show_details()}>
            {#key current.media.id}
              <TodayPosterDetails
                media={current.media}
                kicker={titleOf(current.because)
                  ? m.text_mixtape_because({
                      title: titleOf(current.because) ?? "",
                    })
                  : null}
              />
            {/key}
            <div class="fan-panel-footer">
              <Button
                color="purple"
                disabled={isSelectedKept}
                label={isSelectedKept
                  ? m.tag_mixtape_kept()
                  : m.button_text_mixtape_keep()}
                onclick={keep}
              >
                {isSelectedKept
                  ? m.tag_mixtape_kept()
                  : m.button_text_mixtape_keep()}
              </Button>
              <button
                type="button"
                class="fan-another"
                aria-label={m.button_text_mixtape_show_another()}
                disabled={!canSwap || isSelectedKept}
                onclick={() => swap(selected)}
              >
                <SwapIcon />
              </button>
            </div>
          </aside>
        {/if}
      </div>

      <footer class="fan-bar">
        <p>
          <span class="bold">{m.text_mixtape_more_to_go({ left })}</span>
          <span class="secondary">{m.text_mixtape_saved_as_you_go()}</span>
        </p>
        {#if round.length > 0}
          <button
            type="button"
            class="fan-finish"
            onclick={() => (isFinished = true)}
          >
            {m.button_text_mixtape_finish_with({ count: round.length })}
          </button>
        {/if}
      </footer>
    </div>
  {/if}

  {#if swapped && swappedIn}
    <div class="fan-toast" role="status">
      <span>{m.text_mixtape_swapped({ old: swapped.title, new: swappedIn })}</span>
      <button type="button" onclick={undo}>{m.button_text_undo()}</button>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-fan {
    container: mixtape-fan / inline-size;
    position: relative;
    overflow: hidden;
    margin-inline: var(--layout-distance-side);
    border-radius: var(--border-radius-xl);
  }

  .fan-backdrop {
    position: absolute;
    inset: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.5;
      filter: saturate(1.15);
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(
          120% 90% at 30% 40%,
          transparent 0%,
          color-mix(in srgb, var(--color-background) 55%, transparent) 45%,
          var(--color-background) 85%
        ),
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 20%, transparent),
          color-mix(in srgb, var(--color-background) 92%, transparent) 88%
        );
    }
  }

  .fan-layout {
    position: relative;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    padding: var(--ni-32) var(--ni-48) var(--ni-40);

    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 30%, transparent) 0%,
      color-mix(in srgb, var(--color-background) 85%, transparent) 100%
    );

    p,
    h2 {
      margin: 0;
    }
  }

  .fan-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    h2 {
      font-size: var(--ni-30);
      letter-spacing: -0.01em;
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .fan-spacer {
    flex: 1;
  }

  .fan-picks {
    padding-block: var(--ni-4);
    padding-inline-start: var(--ni-4);
    padding-inline-end: var(--ni-12);
    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--color-foreground) 7%, transparent);
  }

  .fan-close {
    display: grid;
    place-items: center;
    width: var(--ni-40);
    height: var(--ni-40);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 7%, transparent);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .fan-main {
    display: flex;
    gap: var(--gap-m);
    height: clamp(
      var(--ni-480),
      calc(100dvh - var(--ni-280)),
      var(--ni-640)
    );
  }


  .fan-stage {
    --width-mixtape-fan-poster: min(var(--ni-260), 32cqi);

    container: mixtape-fan-stage / inline-size;
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .fan-panel {
    flex: 0 0 calc(var(--ni-380) + var(--ni-12));

    display: flex;
    flex-direction: column;
    overflow: hidden;

    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-xl);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    > :global(.trakt-today-poster-details) {
      flex: 1;
      height: auto;
    }
  }

  @container mixtape-fan (width < 60rem) {
    .fan-layout {
      padding: var(--gap-l) var(--gap-m);
    }

    .fan-main {
      flex-direction: column;
      gap: var(--gap-l);
      height: auto;
    }

    .fan-stage {
      flex: none;
      height: calc(var(--width-mixtape-fan-poster) * 1.5 + var(--ni-80));
    }

    .fan-panel {
      flex-basis: auto;
      height: var(--ni-520);
    }
  }

  .fan-panel-footer {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--gap-s) var(--gap-m) var(--gap-m);

    > :global(.trakt-button) {
      flex: 1;
    }
  }

  .fan-bar {
    align-self: center;
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding-block: var(--ni-8);
    padding-inline-start: var(--ni-18);
    padding-inline-end: var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--color-card-background) 90%, transparent);
    box-shadow:
      0 0 0 var(--border-thickness-xxs) var(--color-border),
      var(--shadow-floating);
    font-size: var(--font-size-text-small);

    p {
      display: flex;
      gap: var(--ni-6);
    }
  }

  .fan-finish {
    all: unset;
    padding: var(--ni-8) var(--ni-16);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    font-weight: 700;
    cursor: pointer;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
    }
  }

  .fan-another {
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

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 14%, transparent);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  .fan-toast {
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

    border-radius: var(--border-radius-xxl);
    background: var(--shade-940);
    color: var(--shade-10);
    box-shadow: var(--shadow-floating);
    font-size: var(--font-size-text-small);
    white-space: nowrap;

    button {
      all: unset;
      padding: var(--ni-2) var(--ni-6);
      border-radius: var(--border-radius-s);
      color: var(--purple-300);
      font-weight: 700;
      cursor: pointer;

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--purple-300);
      }
    }
  }
</style>
