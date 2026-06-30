<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { sum } from "$lib/utils/number/sum.ts";
  import { collapseToOther } from "./collapseToOther.ts";
  import type {
    SegmentedBarItem,
    SegmentedBarProps,
  } from "./models/SegmentedBarProps.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";

  // SOT for the single proportional segmented bar (e.g. a genre breakdown):
  // one continuous bar split into shares, each segment on the categorical viz
  // palette with the shared glossy fill + outer-corner rounding. Labels
  // alternate above/below so adjacent ones don't collide. Hovering a segment
  // dims the rest, lifts it, and reveals its share via the shared tooltip.
  // When categories exceed `maxSegments`, the smallest collapse into a single
  // "Other" bucket so the run never degrades into slivers; on mobile the
  // beside-the-bar labels give way to a legend list under the bar.
  const {
    items = [],
    label = "Segmented distribution",
    minSegment = 0.04,
    maxSegments = 8,
  }: SegmentedBarProps = $props();

  type DisplayItem = SegmentedBarItem & { isOther?: boolean };

  const displayItems = $derived.by<DisplayItem[]>(() => {
    const { visible, other } = collapseToOther(items, maxSegments);
    if (!other) return visible;

    return [
      ...visible,
      {
        label: m.chart_label_other(),
        value: other.value,
        sublabel: m.chart_label_grouped_categories({ count: other.count }),
        isOther: true,
      },
    ];
  });

  const total = $derived(sum(displayItems.map((item) => item.value)));

  const segments = $derived.by(() => {
    const base = displayItems.map((item, index) => {
      const share = ratio({ value: item.value, total });
      const slot = vizSeriesSlot(item.seriesIndex ?? index);
      const color = item.color ??
        (item.isOther ? "var(--viz-neutral)" : `var(--viz-${slot})`);
      return {
        ...item,
        index,
        color,
        percent: Math.round(share * 100),
        grow: item.value > 0 ? Math.max(share, minSegment) : minSegment,
      };
    });

    // Labels alternate rows, so each only competes with the next same-row
    // label (two segments over). Let a label span its own slot plus the
    // opposite-row neighbour beside it, expressed as a multiple of its own
    // width so the clamp tracks the real gap, not a flat 200%.
    return base.map((segment, index) => {
      const nextSameRow = index + 2;
      const span = nextSameRow < base.length
        ? segment.grow + (base.at(index + 1)?.grow ?? 0)
        : sum(base.slice(index).map((s) => s.grow));
      return { ...segment, labelMax: segment.grow > 0 ? span / segment.grow : 1 };
    });
  });
</script>

<figure class="trakt-segmented-bar" role="img" aria-label={label}>
  <figcaption class="viz-caption">{label}</figcaption>

  <div class="segmented-track">
    {#each segments as segment (segment.index)}
      <div
        class="segment"
        class:is-below={segment.index % 2 === 1}
        style="--seg-grow: {segment.grow}; --seg-label-max: {segment.labelMax}; --seg-color: {segment.color}; --viz-series: {segment.color}; --i: {segment.index};"
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

  <!-- Mobile fallback: beside-the-bar labels can't fit, so list shares here. -->
  <ul class="segment-legend">
    {#each segments as segment (segment.index)}
      <li class="legend-row" style="--seg-color: {segment.color};">
        <span class="legend-swatch"></span>
        <span class="legend-name bold ellipsis">{segment.label}</span>
        {#if segment.sublabel}
          <span class="legend-sub tag secondary">{segment.sublabel}</span>
        {/if}
        <span class="legend-percent tag secondary">{segment.percent}%</span>
      </li>
    {/each}
  </ul>
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-segmented-bar {
    position: relative;
    width: 100%;
    margin: 0;
    // Keep horizontal padding (added by consumers on mobile) inside the 100%
    // width so the full-width bar never overflows the container.
    box-sizing: border-box;
    // Room above + below the bar for the alternating labels.
    padding-block: var(--ni-44);
    // Anchor labels/legend to the start so a centered consumer (e.g. the
    // ratings hero) can't inherit-center them.
    text-align: start;
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

    // Reveal the focused segment's full label over the dimmed neighbours.
    .segment:hover {
      z-index: 1;
    }

    .segment:hover .segment-label {
      max-width: none;
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
    // Span own slot + opposite-row neighbour (see --seg-label-max), less a gap
    // so the name only clips when it reaches the next same-row label.
    max-width: calc(var(--seg-label-max, 2) * 100% - var(--ni-12));
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

  // Legend is the mobile-only fallback for the beside-the-bar labels.
  .segment-legend {
    display: none;
    flex-direction: column;
    gap: var(--ni-6);
    margin: 0;
    margin-block-start: var(--ni-12);
    padding: 0;
    list-style: none;
  }

  .legend-row {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .legend-swatch {
    flex: none;
    width: var(--ni-12);
    height: var(--ni-12);
    border-radius: var(--border-radius-xs);
    background: var(--seg-color);
  }

  .legend-name {
    flex: 1 1 auto;
    min-width: 0;
    font-size: var(--font-size-text);
    color: var(--color-text-primary);
  }

  .legend-sub {
    flex: none;
    color: var(--color-text-secondary);
  }

  .legend-percent {
    flex: none;
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
  }

  @include for-mobile {
    // Beside-the-bar labels need horizontal room there isn't; drop them and
    // reclaim the vertical padding they reserved, then surface the legend.
    .trakt-segmented-bar {
      padding-block: 0;
    }

    .segment-label {
      display: none;
    }

    .segment-legend {
      display: flex;
    }
  }
</style>
