<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import SwapIcon from "$lib/components/icons/SwapIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import TodayPosterDetails from "$lib/sections/today/TodayPosterDetails.svelte";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import MixtapeFanPoster from "./MixtapeFanPoster.svelte";
  import MixtapePicks from "./MixtapePicks.svelte";
  import type { MixtapeResultsProps } from "./MixtapeResultsProps.ts";
  import { toMediaStoreProps } from "./toMediaStoreProps.ts";

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
    onSkip,
    onUndo,
    onResult,
  }: Omit<MixtapeResultsProps, "isLoading" | "onMore" | "startOverHref"> =
    $props();

  let selected = $state(0);
  let swapping = $state<number | null>(null);
  let swapped = $state<{ index: number; title: string } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  let swapTimer: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    clearTimeout(swapTimer);
    clearTimeout(toastTimer);
  });

  const current = $derived(slots.at(selected) ?? slots.at(0));
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

  <div class="fan-layout">
    <header class="fan-header">
      <div class="fan-heading">
        <h2>{m.header_mixtape_results()}</h2>
        <MixtapePicks {picked} --width-mixtape-pick="var(--ni-32)" />
      </div>
      <Button
        href={changeHref}
        variant="secondary"
        label={m.button_text_mixtape_change_picks()}
      >
        {m.button_text_mixtape_change_picks()}
      </Button>
      <Link href={closeHref} color="inherit" label={m.button_label_close()}>
        <span class="fan-close"><CloseIcon /></span>
      </Link>
    </header>

    {#if current}
      <div class="fan-main">
        <div class="fan-stage">
          {#each slots as slot, index (slot.media.id)}
            <MixtapeFanPoster
              {slot}
              place={PLACES[index] ?? "center"}
              isSelected={index === selected}
              isSwapping={index === swapping}
              {canSwap}
              onSelect={() => select(index)}
              onSwap={() => swap(index)}
            />
          {/each}
        </div>

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
            <button
              type="button"
              class="fan-another"
              disabled={!canSwap}
              onclick={() => swap(selected)}
            >
              <SwapIcon />
              {m.button_text_mixtape_show_another()}
            </button>
            <WatchlistAction
              {...toMediaStoreProps(current.media)}
              style="normal"
              title={current.media.title}
              onAdd={() => onResult("watchlist", selected + 1)}
            />
          </div>
        </aside>
      </div>
    {:else}
      <p class="secondary">{m.text_mixtape_results_empty()}</p>
    {/if}
  </div>

  {#if swapped && swappedIn}
    <div class="fan-toast" role="status">
      <span>{m.text_mixtape_swapped({ old: swapped.title, new: swappedIn })}</span>
      <button type="button" onclick={undo}>{m.button_text_undo()}</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape-fan {
    --width-mixtape-fan-poster: min(var(--ni-232), 30cqi);

    container: mixtape-fan / inline-size;
    position: relative;
    overflow: hidden;
    margin-inline: var(--layout-distance-side);
    border-radius: var(--border-radius-xl);
  }

  .fan-backdrop {
    position: absolute;
    inset: 0;
    opacity: 0.28;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(var(--ni-32));
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
    gap: var(--gap-m);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .fan-heading {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    flex: 1;
    min-width: 0;
  }

  .fan-close {
    display: grid;
    place-items: center;
    width: var(--ni-44);
    height: var(--ni-44);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .fan-main {
    display: flex;
    gap: var(--ni-48);
    min-height: var(--ni-640);
  }


  .fan-stage {
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
      min-height: auto;
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
    justify-content: space-between;
    gap: var(--gap-s);
    padding: var(--gap-s) var(--gap-m) var(--gap-m);
  }

  .fan-another {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    padding: var(--ni-6) var(--ni-8);

    border-radius: var(--border-radius-s);
    color: var(--color-text-secondary);
    font-size: var(--font-size-text-small);
    font-weight: 700;
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
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
    padding: var(--ni-10) var(--ni-12) var(--ni-10) var(--ni-16);

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
