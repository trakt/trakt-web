<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { time } from "$lib/utils/timing/time";
  import { ScaleTypes } from "@carbon/charts";
  import { AreaChart, type AreaChartOptions } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { flushSync } from "svelte";
  import type { AreaChartProps, TooltipArgs } from "./models/AreaChartProps";

  const dotRadius = 7;
  const chartPaddingVar = "var(--ni-12)";

  const {
    data,
    tooltip,
    lineColor = "var(--color-text-primary)",
    fillColor = "transparent",
    dotColor,
    dotHaloColor = "transparent",
  }: AreaChartProps = $props();

  // Default the dot to the line color so a consumer that just picks a line
  // color gets a coherent hover marker without extra plumbing.
  const resolvedDotColor = $derived(dotColor ?? lineColor);

  // Carbon Charts groups area data by `group`; everything sits in a single
  // group so the area is one continuous shape.
  const carbonData = $derived(
    data.map((d) => ({ group: "value", date: d.label, value: d.value })),
  );
  const labels = $derived(data.map((d) => d.label));

  const chartPadding = useVarToPixels(chartPaddingVar);
  const { observedDimension: observedContainerDimension, observeDimension } =
    useDimensionObserver("width", time.fps(30));

  const observedDimension = $derived(
    $observedContainerDimension - $chartPadding * 2,
  );

  let tooltipContainer: HTMLDivElement | undefined = $state();
  let tooltipArgs: TooltipArgs | null = $state(null);

  const customHTML = $derived(
    (points: Array<{ value: number; date: string }>) => {
      if (!tooltip || !tooltipContainer || !points?.length) return "";
      const point = points[0];
      const index = labels.indexOf(point.date);
      tooltipArgs = { value: point.value, label: point.date, index };
      flushSync();
      return tooltipContainer.innerHTML;
    },
  );

  const options: AreaChartOptions = $derived({
    axes: {
      bottom: {
        mapsTo: "date",
        scaleType: ScaleTypes.LABELS,
      },
      left: {
        mapsTo: "value",
        visible: false,
      },
    },
    grid: {
      x: { enabled: false },
      y: { enabled: false },
    },
    // Points render at a fixed radius but invisible by default
    // (fillOpacity: 0). The CSS below fades them in on hover so we get a
    // stable pin at the active data point. Keeping `r` constant avoids
    // fighting Carbon's own hover animation, which writes inline `r`
    // attributes that would clobber a CSS transition.
    points: { enabled: true, radius: dotRadius, fillOpacity: 0 },
    legend: { enabled: false },
    toolbar: { enabled: false },
    tooltip: {
      enabled: tooltip != null,
      customHTML,
    },
    resizable: false,
    width: `${observedDimension}px`,
    height: "var(--height-area-chart)",
    // Colors are passed as resolved CSS strings (props), not via wrapper-set
    // CSS vars, because Carbon resolves `color.scale.value` at chart-init
    // context where the wrapper's scoped vars aren't accessible. Passing
    // globally-defined references (e.g. `var(--shade-10)`) keeps the values
    // theme-aware while still resolving anywhere.
    color: {
      scale: { value: lineColor },
    },
    getStrokeColor: () => lineColor,
    getFillColor: () => fillColor,
  });
</script>

<div
  class="trakt-area-chart"
  use:observeDimension
  style="--chart-padding: {$chartPadding}px; --area-chart-dot: {resolvedDotColor}; --area-chart-dot-halo: {dotHaloColor};"
>
  <AreaChart data={carbonData} {options} />

  <!--
    CarbonCharts does not support snippets as tooltips. So we render them to a
    hidden container and pull the HTML into Carbon's custom tooltip renderer.
    This way, at least from a consumer pov, a snippet can be passed in.
  -->
  <div bind:this={tooltipContainer} style="display:none" aria-hidden="true">
    {#if tooltip && tooltipArgs}
      {@render tooltip(tooltipArgs)}
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-area-chart {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: var(--chart-padding);
    box-sizing: border-box;

    :global(.cds--chart-holder) {
      --cds-grid-bg: transparent;
      --cds-text-primary: var(
        --color-area-chart-text-primary,
        var(--color-text-primary)
      );
      --cds-text-secondary: var(
        --color-area-chart-text-secondary,
        var(--color-text-secondary)
      );
    }

    // Area + line colors come from Carbon's getFillColor / getStrokeColor
    // callbacks (see options above), so we only need width + opacity here.
    :global(.area) {
      fill-opacity: 1;
    }

    :global(.line) {
      stroke-width: var(--width-area-chart-line, var(--ni-2));
    }

    // Hover marker for the active data point. Hidden by default (radius is
    // set via Carbon's points option but opacity stays 0 so the dots are
    // invisible). On `.hovered` the dot fades in. We avoid any CSS
    // `transform` here because Safari's SVG transform handling fights
    // Carbon's own inline `r` updates, causing the dot to flicker.
    :global(circle.dot) {
      fill: var(--area-chart-dot);
      stroke: var(--area-chart-dot-halo);
      stroke-width: var(--ni-2);
      fill-opacity: 0;
      stroke-opacity: 0;
      transition:
        fill-opacity var(--transition-increment) ease-out,
        stroke-opacity var(--transition-increment) ease-out;
    }

    :global(circle.dot.hovered) {
      fill-opacity: 1;
      stroke-opacity: 0.8;
    }

    :global(.tick line),
    :global(.domain) {
      stroke: transparent;
    }
  }

  // Carbon mounts the tooltip wrapper outside .cds--chart-holder, so consumer
  // tooltip styles can't reach it through the normal cascade. Flatten the
  // wrapper here so consumer tooltip styling shows through cleanly.
  :global(.cds--cc--tooltip) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
</style>
