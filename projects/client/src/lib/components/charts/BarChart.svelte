<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { time } from "$lib/utils/timing/time";
  import { scaleBand, scaleLinear } from "d3";
  import { createPlotInteraction } from "./_internal/createPlotInteraction.svelte.ts";
  import { nearestIndex } from "./_internal/nearestIndex.ts";
  import { nextVizId } from "./_internal/nextVizId.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";
  import VizDefs from "./_internal/VizDefs.svelte";
  import type { BarChartProps, TooltipArgs } from "./models/BarChartProps.ts";

  const LABEL_BAND = 18;
  // When the active bar's top is within this many px of the plot top, flip the
  // tooltip below it so it isn't clipped by the chart's container.
  const TOOLTIP_FLIP_THRESHOLD = 52;

  const {
    data,
    tickLabels,
    tooltip,
    barSpacing = 2,
    seriesIndex = 0,
    highlightPeak = true,
    label = "Bar chart",
    height = "var(--height-bar-chart)",
  }: BarChartProps = $props();

  const prefix = nextVizId("viz-bar");

  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width", time.fps(30));
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height", time.fps(30));

  const slot = $derived(vizSeriesSlot(seriesIndex));
  const barFill = $derived(`url(#${prefix}-fill-${slot})`);
  const seriesColor = $derived(`var(--viz-${slot})`);

  const width = $derived($observedWidth);
  const height$ = $derived($observedHeight);
  const margin = 3;
  const labelBand = $derived(tickLabels ? LABEL_BAND : 0);
  const baseline = $derived(Math.max(height$ - margin - labelBand, 0));
  const innerWidth = $derived(Math.max(width - margin * 2, 0));

  const values = $derived(data.map((d) => d.value));
  const maxValue = $derived(Math.max(...values, 0));
  const hasPlot = $derived(width > 0 && height$ > 0 && data.length > 0);

  const xScale = $derived.by(() => {
    const step = data.length > 0 ? innerWidth / data.length : innerWidth;
    // Translate the px gap into d3's ratio padding, capped so bars never vanish.
    const padding = step > 0 ? Math.min(barSpacing / step, 0.9) : 0;
    return scaleBand<number>()
      .domain(data.map((_, index) => index))
      .range([margin, width - margin])
      .paddingInner(padding)
      .paddingOuter(padding / 2);
  });

  const yScale = $derived.by(() => {
    // Flat-span guard: a zero span divides by zero and turns float noise into a
    // jittering baseline. Pad to a unit span so equal values render flat.
    const max = maxValue === 0 ? 1 : maxValue;
    return scaleLinear().domain([0, max]).range([baseline, margin]);
  });

  const bars = $derived(
    data.map((d, index) => {
      const x = xScale(index) ?? margin;
      const y = yScale(d.value);
      return {
        x,
        y,
        width: xScale.bandwidth(),
        height: Math.max(baseline - y, 0),
        center: x + xScale.bandwidth() / 2,
        isPeak: highlightPeak && d.value === maxValue && maxValue > 0,
      };
    }),
  );

  const interaction = createPlotInteraction({
    resolveIndex: (clientX, rect) =>
      nearestIndex({
        positions: bars.map((bar) => bar.center),
        target: clientX - rect.left,
      }),
    count: () => data.length,
  });

  const ticks = $derived(
    (tickLabels ?? []).map((text, index) => ({
      text,
      center: bars[index]?.center ?? 0,
    })).filter((tick) => tick.text !== ""),
  );

  const tooltipArgs = $derived.by<TooltipArgs | null>(() => {
    const index = interaction.activeIndex;
    if (index == null || !data[index]) return null;
    return { value: data[index].value, label: data[index].label, index };
  });
  const activeBar = $derived(
    interaction.activeIndex != null ? bars[interaction.activeIndex] : null,
  );
  // Screen-reader readout of the focused/active point (aria-live region).
  const activeReadout = $derived(
    tooltipArgs ? `${tooltipArgs.label}: ${tooltipArgs.value}` : "",
  );
</script>

<figure
  class="trakt-bar-chart"
  class:has-peak={highlightPeak}
  use:observeWidth
  use:observeHeight
  style="--bar-chart-height: {height}; --viz-series: {seriesColor};"
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
    aria-roledescription="interactive bar chart"
    tabindex="0"
    class="bar-chart-plot"
    onpointerdown={interaction.handlers.pointerdown}
    onpointermove={interaction.handlers.pointermove}
    onpointerup={interaction.handlers.pointerup}
    onpointerleave={interaction.handlers.pointerleave}
    onkeydown={interaction.handlers.keydown}
    onblur={interaction.handlers.blur}
  >
    <VizDefs {prefix} />

    {#if hasPlot}
      {#each bars as bar, index (data[index].label)}
        <g
          class="bar"
          class:is-peak={bar.isPeak}
          class:is-active={index === interaction.activeIndex}
          style="--i: {index};"
        >
          <rect
            class="bar-fill"
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            style="y: {bar.y}px; height: {bar.height}px; fill: {barFill}; --bar-base: {baseline}px;"
          />
          <!-- High-contrast hatch overlay; gated by --viz-pattern-opacity. -->
          <rect
            class="bar-pattern"
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill={`url(#${prefix}-pattern-${slot})`}
            style="y: {bar.y}px; height: {bar.height}px;"
          />
        </g>
      {/each}

      {#each ticks as tick (tick.center)}
        <text
          class="bar-tick"
          x={tick.center}
          y={height$ - margin}
          text-anchor="middle"
        >
          {tick.text}
        </text>
      {/each}
    {/if}
  </svg>

  {#if tooltip && tooltipArgs && activeBar}
    <div
      class="bar-chart-tooltip"
      class:is-pinned={interaction.pinned}
      class:is-below={activeBar.y < TOOLTIP_FLIP_THRESHOLD}
      style:left="{activeBar.center}px"
      style:top="{activeBar.y}px"
    >
      {@render tooltip(tooltipArgs)}
    </div>
  {/if}
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-bar-chart {
    position: relative;
    width: 100%;
    height: var(--bar-chart-height);
    margin: 0;
    color: var(--viz-series);
  }

  .bar-chart-plot {
    display: block;
    width: 100%;
    height: 100%;
    // SVG defaults to overflow:hidden, which slices the active bar's glow into a
    // hard straight edge at the plot boundary. Let the soft bloom bleed out.
    overflow: visible;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    outline: none;

    &:focus-visible {
      @include viz-focus-ring;
    }
  }

  .bar-fill {
    rx: var(--viz-bar-radius);
    // Geometry props (y/height/rx) are CSS-animatable in SVG2, so the bars tween
    // their top + height instead of redrawing on data change. rx lives here
    // (not as an attribute) so it can read the CSS var token.
    transition:
      y var(--viz-morph-duration) ease,
      height var(--viz-morph-duration) ease,
      fill-opacity var(--transition-increment) ease,
      filter var(--transition-increment) ease;
    fill-opacity: 0.62;
    // Rise from the baseline on first paint, staggered left-to-right.
    transform-box: fill-box;
    transform-origin: bottom;
    animation: viz-bar-rise var(--viz-enter-duration) var(--viz-enter-ease)
      calc(var(--i) * 45ms) both;
  }

  .bar-pattern {
    rx: var(--viz-bar-radius);
    color: var(--viz-series);
    opacity: var(--viz-pattern-opacity);
    transition:
      y var(--viz-morph-duration) ease,
      height var(--viz-morph-duration) ease;
  }

  // When no peak highlight, every bar reads at full strength.
  .trakt-bar-chart:not(.has-peak) .bar-fill {
    fill-opacity: 1;
  }

  // Peak just reads at full strength at rest - no resting bloom, which looked
  // like a stray haze on small distributions. The glow is reserved for the
  // active (hover/pin) bar so it stays an interaction affordance.
  .bar.is-peak .bar-fill {
    fill-opacity: 1;
  }

  .bar.is-active .bar-fill {
    fill-opacity: 1;
    @include viz-hover-active;
  }

  .bar-tick {
    fill: var(--viz-label);
    font-size: var(--font-size-tag);
    text-anchor: middle;
  }

  .bar-chart-tooltip {
    position: absolute;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-8)));
    z-index: var(--layer-top);

    // Tall bar near the top: anchor below the bar's top edge instead so the
    // tooltip stays inside the chart and isn't clipped.
    &.is-below {
      transform: translate(-50%, var(--ni-8));
    }
  }

  .viz-caption {
    @include visually-hidden;
  }

  @keyframes viz-bar-rise {
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
    .bar-fill {
      animation: none;
    }
  }
</style>
