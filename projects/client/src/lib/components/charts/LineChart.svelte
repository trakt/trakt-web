<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { resampleSeries } from "$lib/utils/number/resampleSeries.ts";
  import { time } from "$lib/utils/timing/time";
  import { scaleLinear, scalePoint } from "d3";
  import { buildAreaPath } from "./_internal/buildAreaPath.ts";
  import { buildLinePath } from "./_internal/buildLinePath.ts";
  import { createPlotInteraction } from "./_internal/createPlotInteraction.svelte.ts";
  import { nearestIndex } from "./_internal/nearestIndex.ts";
  import { nextVizId } from "./_internal/nextVizId.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";
  import VizDefs from "./_internal/VizDefs.svelte";
  import type { LineChartProps, TooltipArgs } from "./models/LineChartProps.ts";

  // Fixed sample count keeps the rendered path's command count constant across
  // data changes, so CSS `transition: d` can morph it instead of snapping.
  const MORPH_SAMPLES = 48;
  // Flip the tooltip below the point when it's near the plot top, so it isn't
  // clipped by the chart's container.
  const TOOLTIP_FLIP_THRESHOLD = 52;
  // Vertical space reserved under the plot for x-axis tick labels.
  const LABEL_BAND = 18;

  const {
    data,
    tooltip,
    seriesIndex = 0,
    color,
    showArea = false,
    baseline,
    showDots = false,
    tickLabels,
    fillColor,
    dotColor,
    dotHaloColor,
    label = "Line chart",
    height = "var(--height-area-chart)",
  }: LineChartProps = $props();

  const prefix = nextVizId("viz-line");

  const dotRadius = useVarToPixels("var(--viz-dot-radius)");
  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width", time.fps(30));
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height", time.fps(30));

  const slot = $derived(vizSeriesSlot(seriesIndex));
  const lineColor = $derived(color ?? `var(--viz-${slot})`);
  const areaFill = $derived(fillColor ?? `url(#${prefix}-area)`);
  const resolvedDot = $derived(dotColor ?? lineColor);
  const resolvedHalo = $derived(dotHaloColor ?? "var(--color-card-background)");

  const margin = $derived(Math.max($dotRadius + 3, 5));
  const labelBand = $derived(tickLabels ? LABEL_BAND : 0);
  const width = $derived($observedWidth);
  const height$ = $derived($observedHeight);
  const innerWidth = $derived(Math.max(width - margin * 2, 0));
  // Bottom of the plotting area, lifted above the tick-label band.
  const plotBottom = $derived(height$ - margin - labelBand);

  const values = $derived(data.map((d) => d.value));
  const hasPlot = $derived(width > 0 && height$ > 0 && data.length > 0);

  const yScale = $derived.by(() => {
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const floor = baseline ?? Math.min(dataMin, 0);
    const top = Math.max(dataMax, floor);
    // Flat-span guard: a zero-height domain divides by zero and amplifies
    // float jitter into a jumping baseline; pad it to a unit span.
    const ceil = floor === top ? floor + 1 : top;
    return scaleLinear().domain([floor, ceil]).range([plotBottom, margin]);
  });

  const ticks = $derived(
    (tickLabels ?? []).map((text, index) => ({
      text,
      x: points[index]?.x ?? margin,
    })).filter((tick) => tick.text !== ""),
  );

  const xScale = $derived(
    scalePoint<number>()
      .domain(data.map((_, index) => index))
      .range([margin, width - margin]),
  );

  // Original data positions drive markers + hit-testing.
  const points = $derived(
    data.map((d, index) => ({
      x: xScale(index) ?? margin,
      y: yScale(d.value),
    })),
  );

  // A fixed-length monotone resample drives the morphing line/area path.
  const smoothPoints = $derived.by(() => {
    const sampled = resampleSeries({ values, targetLength: MORPH_SAMPLES });
    return sampled.map((value, index) => ({
      x: margin + (index / (MORPH_SAMPLES - 1)) * innerWidth,
      y: yScale(value),
    }));
  });

  const areaBaseY = $derived(
    Math.min(Math.max(yScale(baseline ?? 0), margin), plotBottom),
  );
  const linePath = $derived(hasPlot ? buildLinePath(smoothPoints) : "");
  const areaPath = $derived(
    hasPlot
      ? buildAreaPath({ points: smoothPoints, baseline: areaBaseY })
      : "",
  );

  const interaction = createPlotInteraction({
    resolveIndex: (clientX, rect) =>
      nearestIndex({
        positions: points.map((p) => p.x),
        target: clientX - rect.left,
      }),
    count: () => data.length,
  });

  const activePoint = $derived(
    interaction.activeIndex != null ? points[interaction.activeIndex] : null,
  );
  const tooltipArgs = $derived.by<TooltipArgs | null>(() => {
    const index = interaction.activeIndex;
    if (index == null || !data[index]) return null;
    return { value: data[index].value, label: data[index].label, index };
  });
  // Screen-reader readout of the focused/active point (aria-live region).
  const activeReadout = $derived(
    tooltipArgs ? `${tooltipArgs.label}: ${tooltipArgs.value}` : "",
  );
</script>

<figure
  class="trakt-line-chart"
  use:observeWidth
  use:observeHeight
  style="--line-chart-height: {height}; --viz-series: {lineColor};"
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
    aria-roledescription="interactive line chart"
    tabindex="0"
    class="line-chart-plot"
    onpointerdown={interaction.handlers.pointerdown}
    onpointermove={interaction.handlers.pointermove}
    onpointerup={interaction.handlers.pointerup}
    onpointerleave={interaction.handlers.pointerleave}
    onkeydown={interaction.handlers.keydown}
    onblur={interaction.handlers.blur}
  >
    <VizDefs {prefix} />

    {#if hasPlot}
      {#if showArea}
        <path
          class="area-path"
          d={areaPath}
          style="d: path('{areaPath}'); fill: {areaFill};"
        />
        <!-- High-contrast hatch overlay; invisible until --viz-pattern-opacity > 0. -->
        <path
          class="area-pattern"
          d={areaPath}
          fill={`url(#${prefix}-pattern-${slot})`}
          style="d: path('{areaPath}');"
        />
      {/if}

      <path
        class="line-path"
        d={linePath}
        fill="none"
        pathLength="1"
        style="d: path('{linePath}');"
      />

      {#if showDots}
        {#each points as point, index (data[index].label)}
          <circle
            class="data-dot"
            cx={point.x}
            cy={point.y}
            r={$dotRadius * 0.8}
            style="fill: {resolvedDot}; stroke: {resolvedHalo};"
          />
        {/each}
      {/if}

      {#each ticks as tick (tick.text)}
        <text
          class="line-tick"
          x={tick.x}
          y={height$ - margin}
          text-anchor="middle"
        >
          {tick.text}
        </text>
      {/each}

      {#if activePoint}
        <line
          class="active-guide"
          x1={activePoint.x}
          y1={margin}
          x2={activePoint.x}
          y2={plotBottom}
        />
        <circle
          class="active-dot"
          cx={activePoint.x}
          cy={activePoint.y}
          r={$dotRadius}
          style="fill: {resolvedDot}; stroke: {resolvedHalo};"
        />
      {/if}
    {/if}
  </svg>

  {#if tooltip && tooltipArgs && activePoint}
    <div
      class="line-chart-tooltip"
      class:is-pinned={interaction.pinned}
      class:is-below={activePoint.y < TOOLTIP_FLIP_THRESHOLD}
      style:left="{activePoint.x}px"
      style:top="{activePoint.y}px"
    >
      {@render tooltip(tooltipArgs)}
    </div>
  {/if}
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-line-chart {
    position: relative;
    width: 100%;
    height: var(--line-chart-height);
    margin: 0;
    // Tint the area gradient + glow off the series color.
    color: var(--viz-series);
  }

  .line-chart-plot {
    display: block;
    width: 100%;
    height: 100%;
    // SVG defaults to overflow:hidden, which clips the line/dot glow into a hard
    // straight edge at the plot boundary. Let the soft bloom bleed out.
    overflow: visible;
    // Keep the page scrollable vertically over the plot while letting the chart
    // own horizontal gestures; kill native tap highlight + text selection so
    // scrubbing reads as a chart interaction, not a browser one.
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    outline: none;

    &:focus-visible {
      @include viz-focus-ring;
    }
  }

  .line-path {
    stroke: var(--viz-series);
    stroke-width: var(--viz-line-width);
    stroke-linecap: round;
    stroke-linejoin: round;
    // Soft bloom in the series hue gives the line presence over flat strokes;
    // the percentage is theme-driven and drops to 0 in high-contrast mode.
    filter: drop-shadow(
      0 1px var(--viz-glow-blur)
        color-mix(in srgb, var(--viz-series) var(--viz-glow-percent), transparent)
    );
    transition:
      d var(--viz-morph-duration) ease,
      stroke var(--transition-increment) ease;
    // Draw the line on first paint (pathLength normalized to 1).
    animation: viz-line-draw var(--viz-enter-duration) var(--viz-enter-ease)
      both;
  }

  .area-path {
    transition: d var(--viz-morph-duration) ease;
    animation: viz-fade-in var(--viz-enter-duration) var(--viz-enter-ease) both;
  }

  .area-pattern {
    color: var(--viz-series);
    opacity: var(--viz-pattern-opacity);
    transition: d var(--viz-morph-duration) ease;
  }

  .active-guide {
    stroke: var(--viz-axis);
    stroke-width: var(--viz-axis-width);
    stroke-dasharray: 3 4;
    opacity: 0.7;
  }

  .active-dot {
    stroke-width: var(--viz-line-width);
    transform-box: fill-box;
    transform-origin: center;
    @include viz-hover-active;
    animation: viz-pop calc(0.6 * var(--viz-enter-duration)) var(--viz-enter-ease)
      both;
  }

  .data-dot {
    stroke-width: var(--viz-line-width);
    animation: viz-fade-in var(--viz-enter-duration) var(--viz-enter-ease) both;
  }

  .line-tick {
    fill: var(--viz-label);
    font-size: var(--font-size-tag);
    text-anchor: middle;
  }

  .line-chart-tooltip {
    position: absolute;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-12)));
    z-index: var(--layer-top);

    &.is-below {
      transform: translate(-50%, var(--ni-12));
    }
  }

  .viz-caption {
    @include visually-hidden;
  }

  @keyframes viz-line-draw {
    from {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }
    to {
      stroke-dasharray: 1;
      stroke-dashoffset: 0;
    }
  }

  @keyframes viz-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes viz-pop {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .line-path,
    .area-path,
    .active-dot,
    .data-dot {
      animation: none;
    }
  }
</style>
