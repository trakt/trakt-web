<script lang="ts">
  import type { BarChartItem } from "./BarChartItem.ts";

  const SIZE = 240;
  const CENTER = SIZE / 2;
  const INNER = 50;
  const OUTER = 98;
  const LABEL = 112;

  const { items }: { items: ReadonlyArray<BarChartItem> } = $props();

  const max = $derived(Math.max(1, ...items.map((item) => item.value)));
  const peakIndex = $derived(
    items.reduce(
      (best, item, index) =>
        item.value > (items.at(best)?.value ?? -1) ? index : best,
      0,
    ),
  );
  const peak = $derived(items.at(peakIndex));

  let hoveredIndex = $state<number | null>(null);
  const shown = $derived(hoveredIndex === null ? peak : items.at(hoveredIndex));

  const toPoint = (index: number, radius: number) => {
    const angle = (index / items.length) * Math.PI * 2;
    return {
      x: CENTER + radius * Math.sin(angle),
      y: CENTER - radius * Math.cos(angle),
    };
  };

  const bars = $derived(
    items.map((item, index) => {
      const fraction = item.value / max;
      return {
        item,
        fraction,
        from: toPoint(index, INNER),
        to: toPoint(index, INNER + (OUTER - INNER) * Math.max(fraction, 0.04)),
        reach: toPoint(index, OUTER),
      };
    }),
  );
</script>

<div class="trakt-month-review-hour-dial">
  <svg
    viewBox="0 0 {SIZE} {SIZE}"
    role="img"
    aria-label={peak ? `${peak.label}: ${peak.valueLabel}` : ""}
  >
    <circle class="face" cx={CENTER} cy={CENTER} r={INNER - 8} />
    {#each bars as bar, index (index)}
      <line
        class="bar"
        class:is-peak={index === peakIndex && bar.item.value > 0}
        class:is-hovered={index === hoveredIndex}
        x1={bar.from.x}
        y1={bar.from.y}
        x2={bar.to.x}
        y2={bar.to.y}
        style="--viz-bar-strength: {bar.fraction}"
      />
    {/each}
    {#each bars as bar, index (index)}
      <line
        class="hit"
        role="presentation"
        x1={bar.from.x}
        y1={bar.from.y}
        x2={bar.reach.x}
        y2={bar.reach.y}
        onpointerenter={() => (hoveredIndex = index)}
        onpointerleave={() => (hoveredIndex = null)}
      >
        <title>{bar.item.label} · {bar.item.valueLabel}</title>
      </line>
    {/each}
    {#each items as item, index (index)}
      {#if item.axisLabel}
        {@const point = toPoint(index, LABEL)}
        <text class="axis" x={point.x} y={point.y}>{item.axisLabel}</text>
      {/if}
    {/each}
    {#if shown && (hoveredIndex !== null || shown.value > 0)}
      <text class="center" x={CENTER} y={CENTER - 2}>{shown.label}</text>
      <text class="center-sub" x={CENTER} y={CENTER + 16}>
        {shown.valueLabel}
      </text>
    {/if}
  </svg>
</div>

<style>
  .trakt-month-review-hour-dial {
    display: grid;
    place-items: center;

    svg {
      width: 100%;
      max-width: var(--ni-240, var(--ni-244));
      height: auto;
      overflow: visible;
    }
  }

  .face {
    fill: var(--color-month-review-tile);
  }

  .bar {
    stroke: color-mix(
      in oklab,
      var(--viz-3),
      var(--viz-5) clamp(0%, calc(var(--viz-bar-strength) * 100%), 100%)
    );
    stroke-width: 7;
    stroke-linecap: round;
    transition: opacity var(--transition-increment) ease;

    &.is-peak {
      stroke: var(--color-month-review-accent);
    }
  }

  .trakt-month-review-hour-dial:has(.hit:hover) .bar:not(.is-hovered) {
    opacity: 0.55;
  }

  .hit {
    stroke: transparent;
    stroke-width: 18;
    pointer-events: stroke;
  }

  .center,
  .center-sub {
    pointer-events: none;
  }

  .axis {
    fill: var(--color-text-secondary);
    font-size: var(--font-size-tag);
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .center {
    fill: var(--color-text-primary);
    font-size: var(--ni-20);
    font-weight: 700;
    text-anchor: middle;
  }

  .center-sub {
    fill: var(--color-text-secondary);
    font-size: var(--font-size-tag);
    text-anchor: middle;
  }
</style>
