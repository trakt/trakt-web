<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { resampleSeries } from "$lib/utils/number/resampleSeries.ts";
  import { time } from "$lib/utils/timing/time";
  import { scaleLinear } from "d3";
  import { buildAreaPath } from "./_internal/buildAreaPath.ts";
  import { buildLinePath } from "./_internal/buildLinePath.ts";
  import { nextVizId } from "./_internal/nextVizId.ts";
  import { vizSeriesSlot } from "./vizSeriesSlot.ts";
  import VizDefs from "./_internal/VizDefs.svelte";
  import type { SparklineProps } from "./models/SparklineProps.ts";

  // Minimal, non-interactive trend line: shares the morph resampling + path +
  // gradient helpers with LineChart but drops axes, tooltips, and hit-testing.
  const MORPH_SAMPLES = 48;

  const {
    values,
    seriesIndex = 0,
    color,
    showArea = false,
    label = "Sparkline",
    height = "var(--ni-32)",
  }: SparklineProps = $props();

  const prefix = nextVizId("viz-spark");

  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width", time.fps(30));
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height", time.fps(30));

  const slot = $derived(vizSeriesSlot(seriesIndex));
  const lineColor = $derived(color ?? `var(--viz-${slot})`);

  const margin = 2;
  const width = $derived($observedWidth);
  const height$ = $derived($observedHeight);
  const innerWidth = $derived(Math.max(width - margin * 2, 0));
  const hasPlot = $derived(width > 0 && height$ > 0 && values.length > 0);

  const yScale = $derived.by(() => {
    const min = Math.min(...values, 0);
    const dataMax = Math.max(...values, 0);
    const max = min === dataMax ? min + 1 : dataMax;
    return scaleLinear().domain([min, max]).range([height$ - margin, margin]);
  });

  const points = $derived.by(() => {
    const sampled = resampleSeries({ values, targetLength: MORPH_SAMPLES });
    return sampled.map((value, index) => ({
      x: margin + (index / (MORPH_SAMPLES - 1)) * innerWidth,
      y: yScale(value),
    }));
  });

  const baseline = $derived(
    Math.min(Math.max(yScale(0), margin), height$ - margin),
  );
  const linePath = $derived(hasPlot ? buildLinePath(points) : "");
  const areaPath = $derived(
    hasPlot ? buildAreaPath({ points, baseline }) : "",
  );
</script>

<figure
  class="trakt-sparkline"
  use:observeWidth
  use:observeHeight
  style="--sparkline-height: {height}; --viz-series: {lineColor};"
>
  <figcaption class="viz-caption">{label}</figcaption>

  <svg {width} height={height$} role="img" aria-label={label}>
    <VizDefs {prefix} />

    {#if hasPlot}
      {#if showArea}
        <path
          class="sparkline-area"
          d={areaPath}
          style="d: path('{areaPath}'); fill: url(#{prefix}-area);"
        />
      {/if}
      <path
        class="sparkline-line"
        d={linePath}
        fill="none"
        pathLength="1"
        style="d: path('{linePath}');"
      />
    {/if}
  </svg>
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-sparkline {
    position: relative;
    width: 100%;
    height: var(--sparkline-height);
    margin: 0;
    color: var(--viz-series);

    svg {
      display: block;
      width: 100%;
      height: 100%;
      // Let the line glow bleed past the edge rather than clip (SVG defaults to
      // overflow:hidden).
      overflow: visible;
    }
  }

  .sparkline-line {
    stroke: var(--viz-series);
    stroke-width: var(--viz-line-width);
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: d var(--viz-morph-duration) ease;
    animation: viz-spark-draw var(--viz-enter-duration) var(--viz-enter-ease)
      both;
  }

  .sparkline-area {
    transition: d var(--viz-morph-duration) ease;
    animation: viz-spark-fade var(--viz-enter-duration) var(--viz-enter-ease)
      both;
  }

  .viz-caption {
    @include visually-hidden;
  }

  @keyframes viz-spark-draw {
    from {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }
    to {
      stroke-dasharray: 1;
      stroke-dashoffset: 0;
    }
  }

  @keyframes viz-spark-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sparkline-line,
    .sparkline-area {
      animation: none;
    }
  }
</style>
