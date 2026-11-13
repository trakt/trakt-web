<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import SkeletonCard from "$lib/sections/lists/components/SkeletonCard.svelte";
  import { onMount } from "svelte";
  import type { MixtapePickerProps } from "./MixtapePickerProps.ts";

  const ENTRANCE_WINDOW = 1200;
  const MAX_STAGGER_INDEX = 11;

  const {
    picker,
    isLoading,
    isSettling,
    phase,
    pickHref,
    removeHref,
    onPick,
  }: MixtapePickerProps = $props();

  const source = $derived(picker.kind === "search" ? "search" : "grid");
  const emptyText = $derived(
    picker.kind === "search"
      ? m.text_mixtape_no_search_results()
      : picker.kind === "fits"
        ? m.text_mixtape_no_fits()
        : m.text_mixtape_empty_history(),
  );
  const isInert = $derived(phase === "mixing" || isSettling);

  let cells = $state<Record<string, HTMLElement | undefined>>({});
  let isEntering = $state(true);

  onMount(() => {
    const timer = setTimeout(() => (isEntering = false), ENTRANCE_WINDOW);
    return () => clearTimeout(timer);
  });

  const coverRect = (key: string) =>
    cells[key]?.querySelector(".trakt-card-cover")?.getBoundingClientRect() ??
    null;
</script>

{#snippet differentMood()}
  <span class="small secondary ellipsis">{m.tag_mixtape_different_mood()}</span>
{/snippet}

<div class="trakt-mixtape-picker" data-phase={phase}>
  {#if isLoading}
    <div class="picker-grid">
      {#each Array.from({ length: 9 }, (_, index) => index) as index (index)}
        <div class="picker-cell">
          <SkeletonCard {index} listIndex={0} />
        </div>
      {/each}
    </div>
  {:else if picker.items.length === 0}
    <p class="secondary">{emptyText}</p>
  {:else}
    <div
      class="picker-grid"
      class:is-settling={isSettling}
      class:is-entering={isEntering}
      role="list"
      aria-busy={isSettling}
      inert={isInert || undefined}
    >
      {#each picker.items as { media, isOff, slot }, index (media.key)}
        {#snippet slotBadge()}
          <span class="picker-slot-badge">{slot}</span>
        {/snippet}
        <div
          class="picker-cell"
          role="listitem"
          bind:this={cells[media.key]}
          data-slot={slot}
          style:--cell-index={Math.min(index, MAX_STAGGER_INDEX)}
        >
          {#if slot != null}
            <DefaultMediaItem
              type={media.type}
              {media}
              popupActions={null}
              badge={slotBadge}
              urlOverride={{
                href: removeHref(media),
                noscroll: true,
                replacestate: true,
              }}
            />
          {:else if isOff}
            <DefaultMediaItem
              type={media.type}
              {media}
              popupActions={null}
              tag={differentMood}
              canDeemphasize
            />
          {:else}
            <DefaultMediaItem
              type={media.type}
              {media}
              popupActions={null}
              urlOverride={{ href: pickHref(media), noscroll: true }}
              onclick={() => onPick(source, media, coverRect(media.key))}
            />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-picker {
    --picker-stagger-base: var(--transition-increment);
    --picker-stagger-step: calc(var(--transition-increment) / 5);

    .picker-grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(var(--width-portrait-card), 1fr)
      );
      gap: var(--gap-m) var(--gap-xs);
      padding-inline: var(--layout-distance-side);

      transition: opacity var(--transition-increment) ease-in-out;

      &.is-settling {
        opacity: 0.5;
      }

      @include for-mobile {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .picker-cell {
      container-type: inline-size;
      min-width: 0;

      --width-override-card: 100%;
      --height-override-card-cover: calc(100cqi * 1.5);
      --height-override-card: calc(
        100cqi * 1.5 +
          var(--height-portrait-card) - var(--height-portrait-card-cover)
      );

      transition:
        opacity calc(2 * var(--transition-increment)) ease-in-out,
        transform calc(3 * var(--transition-increment))
          cubic-bezier(0.2, 0.8, 0.2, 1);

      &[data-slot] {
        --color-override-card-outline: var(--color-text-primary);
      }
    }

    .picker-grid.is-entering .picker-cell {
      animation: picker-cell-in calc(3 * var(--transition-increment))
        cubic-bezier(0.2, 0.8, 0.2, 1) both;
      animation-delay: calc(
        var(--picker-stagger-base) + var(--cell-index, 0) *
          var(--picker-stagger-step)
      );
    }

    .picker-slot-badge {
      display: flex;
      align-items: center;
      justify-content: center;

      width: var(--ni-24);
      height: var(--ni-24);

      border-radius: var(--border-radius-pill);
      background: var(--color-text-primary);
      box-shadow: var(--shadow-floating);
      color: var(--color-background);
      font-size: var(--font-size-text-small);
      font-weight: 800;
      font-variant-numeric: tabular-nums;

      animation: picker-badge-in calc(2 * var(--transition-increment))
        cubic-bezier(0.34, 1.6, 0.5, 1) both;
    }

    &[data-phase="full"] .picker-cell:not([data-slot]) {
      opacity: 0.35;
      pointer-events: none;
    }

    &[data-phase="mixing"] .picker-cell:not([data-slot]) {
      opacity: 0.15;
    }

    &[data-phase="mixing"] .picker-cell[data-slot] {
      transform: translateY(calc(-1 * var(--ni-6)));
    }

    p {
      padding-inline: var(--layout-distance-side);
      max-width: var(--ni-520);
    }
  }

  @keyframes picker-cell-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-14));
    }
  }

  @keyframes picker-badge-in {
    from {
      transform: scale(0);
    }
  }
</style>
