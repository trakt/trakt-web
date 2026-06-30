<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { sum } from "$lib/utils/number/sum.ts";
  import { time } from "$lib/utils/timing/time";
  import { scaleBand, scaleLinear } from "d3";
  import { createPlotInteraction } from "./_internal/createPlotInteraction.svelte.ts";
  import { nearestIndex } from "./_internal/nearestIndex.ts";
  import { nextVizId } from "./_internal/nextVizId.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";
  import VizDefs from "./_internal/VizDefs.svelte";
  import type {
    StackedBarChartProps,
    StackedTooltipArgs,
  } from "./models/StackedBarChartProps.ts";

  const LABEL_BAND = 18;
  // Flip the tooltip below a tall column's top so it isn't clipped by the
  // chart's container.
  const TOOLTIP_FLIP_THRESHOLD = 52;

  const {
    data,
    seriesLabels,
    tickLabels,
    tooltip,
    barSpacing = 2,
    label = "Stacked bar chart",
    height = "var(--height-bar-chart)",
  }: StackedBarChartProps = $props();

  const prefix = nextVizId("viz-stack");

  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width", time.fps(30));
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height", time.fps(30));

  const width = $derived($observedWidth);
  const height$ = $derived($observedHeight);
  const margin = 3;
  const labelBand = $derived(tickLabels ? LABEL_BAND : 0);
  const baseline = $derived(Math.max(height$ - margin - labelBand, 0));
  const innerWidth = $derived(Math.max(width - margin * 2, 0));

  const totals = $derived(data.map((d) => sum(d.values)));
  const maxTotal = $derived(Math.max(...totals, 0));
  const hasPlot = $derived(width > 0 && height$ > 0 && data.length > 0);

  const xScale = $derived.by(() => {
    const step = data.length > 0 ? innerWidth / data.length : innerWidth;
    const padding = step > 0 ? Math.min(barSpacing / step, 0.9) : 0;
    return scaleBand<number>()
      .domain(data.map((_, index) => index))
      .range([margin, width - margin])
      .paddingInner(padding)
      .paddingOuter(padding / 2);
  });

  const yScale = $derived.by(() => {
    // Flat-span guard so an all-zero dataset renders flat, not NaN.
    const max = maxTotal === 0 ? 1 : maxTotal;
    return scaleLinear().domain([0, max]).range([baseline, margin]);
  });

  const columns = $derived(
    data.map((datum, index) => {
      const x = xScale(index) ?? margin;
      const bandwidth = xScale.bandwidth();
      let cumulative = 0;
      const segments = datum.values.map((value, series) => {
        const yBottom = yScale(cumulative);
        cumulative += value;
        const yTop = yScale(cumulative);
        return {
          series,
          slot: vizSeriesSlot(series),
          y: yTop,
          height: Math.max(yBottom - yTop, 0),
        };
      });
      // Column extent (top of the top segment -> baseline) for the single
      // full-stack sheen overlay.
      const top = yScale(cumulative);
      return {
        x,
        width: bandwidth,
        center: x + bandwidth / 2,
        top,
        height: Math.max(baseline - top, 0),
        segments,
      };
    }),
  );

  const interaction = createPlotInteraction({
    resolveIndex: (clientX, rect) =>
      nearestIndex({
        positions: columns.map((column) => column.center),
        target: clientX - rect.left,
      }),
    count: () => data.length,
  });

  const ticks = $derived(
    (tickLabels ?? []).map((text, index) => ({
      text,
      center: columns[index]?.center ?? 0,
    })).filter((tick) => tick.text !== ""),
  );

  const tooltipArgs = $derived.by<StackedTooltipArgs | null>(() => {
    const index = interaction.activeIndex;
    const datum = index != null ? data[index] : undefined;
    if (index == null || !datum) return null;
    return {
      label: datum.label,
      index,
      total: totals[index] ?? 0,
      segments: datum.values.map((value, series) => ({
        value,
        seriesIndex: series,
        label: seriesLabels?.[series] ?? `Series ${series + 1}`,
      })),
    };
  });
  const activeColumn = $derived(
    interaction.activeIndex != null ? columns[interaction.activeIndex] : null,
  );
  // Screen-reader readout of the focused/active column (aria-live region).
  const activeReadout = $derived(
    tooltipArgs ? `${tooltipArgs.label}: ${tooltipArgs.total}` : "",
  );
</script>

<figure
  class="trakt-stacked-bar-chart"
  use:observeWidth
  use:observeHeight
  style="--stacked-bar-chart-height: {height};"
>
  <figcaption class="viz-caption">{label}</figcaption>
  <div class="viz-caption" aria-live="polite">{activeReadout}</div>

  <!--
    role="img" keeps the static screen-reader summary; the chart is also a
    keyboard widget (focusable, arrow-key scrub, aria-live readout), so the
    tabindex + key handlers are intentional here.
  -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <svg
    {width}
    height={height$}
    role="img"
    aria-label={label}
    aria-roledescription="interactive stacked bar chart"
    tabindex="0"
    class="stacked-bar-chart-plot"
    onpointerdown={interaction.handlers.pointerdown}
    onpointermove={interaction.handlers.pointermove}
    onpointerup={interaction.handlers.pointerup}
    onpointerleave={interaction.handlers.pointerleave}
    onkeydown={interaction.handlers.keydown}
    onblur={interaction.handlers.blur}
  >
    <VizDefs {prefix} />

    {#if hasPlot}
      {#each columns as column, index (data[index].label)}
        <g
          class="column"
          class:is-active={index === interaction.activeIndex}
          style="--i: {index};"
        >
          {#each column.segments as segment (segment.series)}
            <rect
              class="segment-fill"
              x={column.x}
              y={segment.y}
              width={column.width}
              height={segment.height}
              style="y: {segment.y}px; height: {segment.height}px; fill: var(--viz-{segment.slot}); --viz-series: var(--viz-{segment.slot});"
            />
            <rect
              class="segment-pattern"
              x={column.x}
              y={segment.y}
              width={column.width}
              height={segment.height}
              fill={`url(#${prefix}-pattern-${segment.slot})`}
              style="y: {segment.y}px; height: {segment.height}px; color: var(--viz-{segment.slot});"
            />
          {/each}
          <!--
            One sheen across the whole stack = a single light source, so the
            column reads as one unit instead of each segment looking self-lit.
          -->
          <rect
            class="column-sheen"
            x={column.x}
            y={column.top}
            width={column.width}
            height={column.height}
            fill={`url(#${prefix}-sheen)`}
            style="y: {column.top}px; height: {column.height}px;"
            pointer-events="none"
          />
        </g>
      {/each}

      {#each ticks as tick (tick.center)}
        <text
          class="stacked-bar-tick"
          x={tick.center}
          y={height$ - margin}
          text-anchor="middle"
        >
          {tick.text}
        </text>
      {/each}
    {/if}
  </svg>

  {#if tooltip && tooltipArgs && activeColumn}
    <div
      class="stacked-bar-chart-tooltip"
      class:is-pinned={interaction.pinned}
      class:is-below={(activeColumn.segments.at(-1)?.y ?? 0) <
        TOOLTIP_FLIP_THRESHOLD}
      style:left="{activeColumn.center}px"
      style:top="{activeColumn.segments.at(-1)?.y ?? 0}px"
    >
      {@render tooltip(tooltipArgs)}
    </div>
  {/if}
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-stacked-bar-chart {
    position: relative;
    width: 100%;
    height: var(--stacked-bar-chart-height);
    margin: 0;
  }

  .stacked-bar-chart-plot {
    display: block;
    width: 100%;
    height: 100%;
    // Let the active column glow bleed past the plot edge instead of clipping it
    // to a hard line (SVG defaults to overflow:hidden).
    overflow: visible;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    outline: none;

    &:focus-visible {
      @include viz-focus-ring;
    }
  }

  .column {
    // Round only the stack's outer silhouette (top of the top segment + bottom
    // of the bottom segment); inner segment seams stay square so the stack reads
    // as one continuous bar, like a single rounded column.
    clip-path: inset(0 round var(--viz-bar-radius));
    // Rise the whole stack from the baseline on first paint, staggered.
    transform-box: fill-box;
    transform-origin: bottom;
    animation: viz-stack-rise var(--viz-enter-duration) var(--viz-enter-ease)
      calc(var(--i) * 45ms) both;
  }

  .segment-fill {
    transition:
      y var(--viz-morph-duration) ease,
      height var(--viz-morph-duration) ease,
      fill-opacity var(--transition-increment) ease,
      filter var(--transition-increment) ease;
    fill-opacity: 0.78;
  }

  .segment-pattern {
    opacity: var(--viz-pattern-opacity);
    transition:
      y var(--viz-morph-duration) ease,
      height var(--viz-morph-duration) ease;
  }

  .column-sheen {
    transition:
      y var(--viz-morph-duration) ease,
      height var(--viz-morph-duration) ease;
  }

  // Spotlight the hovered/pinned column via the selectable hover treatment.
  .column.is-active .segment-fill {
    fill-opacity: 1;
    @include viz-hover-active;
  }

  .stacked-bar-tick {
    fill: var(--viz-label);
    font-size: var(--font-size-tag);
    text-anchor: middle;
  }

  .stacked-bar-chart-tooltip {
    position: absolute;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-8)));
    z-index: var(--layer-top);

    &.is-below {
      transform: translate(-50%, var(--ni-8));
    }
  }

  .viz-caption {
    @include visually-hidden;
  }

  @keyframes viz-stack-rise {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .column {
      animation: none;
    }
  }
</style>
