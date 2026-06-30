<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { sum } from "$lib/utils/number/sum.ts";
  import type { SegmentedBarProps } from "./models/SegmentedBarProps.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";

  // SOT for the single proportional segmented bar (e.g. a genre breakdown):
  // one continuous bar split into shares, each segment on the categorical viz
  // palette with the shared glossy fill + outer-corner rounding. Labels
  // alternate above/below so adjacent ones don't collide. Hovering a segment
  // dims the rest, lifts it, and reveals its share via the shared tooltip.
  const {
    items,
    label = "Segmented distribution",
    minSegment = 0.04,
  }: SegmentedBarProps = $props();

  const total = $derived(sum(items.map((item) => item.value)));

  const segments = $derived(
    items.map((item, index) => {
      const share = ratio({ value: item.value, total });
      return {
        ...item,
        index,
        slot: vizSeriesSlot(item.seriesIndex ?? index),
        percent: Math.round(share * 100),
        grow: item.value > 0 ? Math.max(share, minSegment) : minSegment,
      };
    }),
  );
</script>

<figure class="trakt-segmented-bar" role="img" aria-label={label}>
  <figcaption class="viz-caption">{label}</figcaption>

  <div class="segmented-track">
    {#each segments as segment (segment.label)}
      <div
        class="segment"
        class:is-below={segment.index % 2 === 1}
        style="--seg-grow: {segment.grow}; --seg-color: var(--viz-{segment.slot}); --viz-series: var(--viz-{segment.slot}); --i: {segment.index};"
      >
        <span class="segment-label">
          <span class="segment-name bold ellipsis">{segment.label}</span>
          {#if segment.sublabel}
            <span class="segment-sub tag secondary ellipsis">
              {segment.sublabel}
            </span>
          {/if}
        </span>
        <Tooltip content="{segment.percent}%" variant="compact" sideOffset={4}>
          <div class="segment-fill"></div>
        </Tooltip>
      </div>
    {/each}
  </div>
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-segmented-bar {
    position: relative;
    width: 100%;
    margin: 0;
    // Room above + below the bar for the alternating labels.
    padding-block: var(--ni-44);
  }

  .segmented-track {
    display: flex;
    gap: var(--ni-2);
    width: 100%;
    height: var(--ni-32);

    // Hovering one segment dims the rest so the focused share stands out.
    @include for-mouse {
      &:hover .segment:not(:hover) {
        opacity: 0.45;
      }
    }
  }

  .segment {
    position: relative;
    flex: var(--seg-grow) 1 0;
    min-width: 0;
    transition: opacity var(--transition-increment) ease;

    :global(.trakt-tooltip-trigger) {
      display: block;
      height: 100%;
    }
  }

  .segment-fill {
    height: 100%;
    // Glossy sheen -> full hue, opaque, matching the rest of the suite.
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--seg-color) 80%, white) 0%,
      var(--seg-color) 70%
    );
    // Square inner seams so the run reads as one bar; only the ends round.
    border-radius: 0;
    transition: filter var(--transition-increment) ease;
  }

  @include for-mouse {
    .segment:hover .segment-fill {
      @include viz-hover-active;
    }
  }

  // Round only the run's outer corners (logical, so they mirror under RTL).
  .segment:first-child .segment-fill {
    border-start-start-radius: var(--viz-bar-radius);
    border-end-start-radius: var(--viz-bar-radius);
  }

  .segment:last-child .segment-fill {
    border-start-end-radius: var(--viz-bar-radius);
    border-end-end-radius: var(--viz-bar-radius);
  }

  .segment-label {
    position: absolute;
    inset-inline-start: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-1);
    max-width: 200%;
    white-space: nowrap;
    // Colored tick tying the label to its segment (inline-start so it mirrors).
    padding-inline-start: var(--ni-6);
    border-inline-start: var(--border-thickness-xs) solid var(--seg-color);
    box-sizing: border-box;
    pointer-events: none;
  }

  // Default: label sits above the bar; even-indexed segments drop below so
  // neighbours never overlap.
  .segment:not(.is-below) .segment-label {
    bottom: calc(100% + var(--ni-8));
  }

  .segment.is-below .segment-label {
    top: calc(100% + var(--ni-8));
  }

  .segment-name {
    font-size: var(--font-size-text);
    color: var(--color-text-primary);
  }

  .segment-sub {
    color: var(--color-text-secondary);
  }

  .viz-caption {
    @include visually-hidden;
  }
</style>
