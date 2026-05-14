<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { time } from "$lib/utils/timing/time";
  import { ScaleTypes } from "@carbon/charts";
  import { AreaChart, type AreaChartOptions } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { flushSync, type Snippet } from "svelte";

  type Datum = { value: number; label: string };
  type TooltipArgs = { value: number; label: string; index: number };

  const {
    data,
    tooltip,
  }: {
    data: Datum[];
    tooltip?: Snippet<[TooltipArgs]>;
  } = $props();

  const chartPadding = useVarToPixels("var(--ni-12)");
  const { observedDimension: observedContainerDimension, observeDimension } =
    useDimensionObserver("width", time.fps(30));

  const observedDimension = $derived(
    $observedContainerDimension - $chartPadding * 2,
  );

  // Carbon Charts groups area data by `group`; everything sits in a single
  // group so the area is one continuous shape.
  const carbonData = $derived(
    data.map((d) => ({ group: "value", date: d.label, value: d.value })),
  );
  const labels = $derived(data.map((d) => d.label));

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
    // Points are rendered at a fixed small radius but invisible by default
    // (fillOpacity: 0). The CSS below fades + scales them in on hover so
    // we get a stable purple dot at the active data point. Keeping `r`
    // constant avoids fighting Carbon's own hover animation, which writes
    // inline `r` attributes that would clobber a CSS transition.
    points: { enabled: true, radius: 7, fillOpacity: 0 },
    legend: { enabled: false },
    toolbar: { enabled: false },
    tooltip: {
      enabled: tooltip != null,
      customHTML,
    },
    resizable: false,
    width: `${observedDimension}px`,
    height: "var(--height-yir-2024-line-chart)",
    // Colors are configured through Carbon's option callbacks so we don't
    // have to fight its inline-style writes from CSS. Carbon then emits the
    // attributes directly on the area / line / dot SVG elements, leaving
    // the stylesheet free of !important overrides.
    color: {
      scale: { value: "var(--color-yir-2024-line, var(--shade-10))" },
    },
    getStrokeColor: () => "var(--color-yir-2024-line, var(--shade-10))",
    getFillColor: () => "var(--color-yir-2024-area, var(--shade-920))",
  });
</script>

<div
  class="yir-2024-line-chart"
  use:observeDimension
  style="--chart-padding: {$chartPadding}px"
>
  <AreaChart data={carbonData} {options} />

  <div bind:this={tooltipContainer} style="display:none" aria-hidden="true">
    {#if tooltip && tooltipArgs}
      {@render tooltip(tooltipArgs)}
    {/if}
  </div>
</div>

<style lang="scss">
  .yir-2024-line-chart {
    --color-yir-2024-line: var(--shade-10);
    // shade-920 (#212427) is the closest semantic match for v2's #222222
    // area fill below the line.
    --color-yir-2024-area: var(--shade-920);

    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: var(--chart-padding);
    box-sizing: border-box;

    :global(.cds--chart-holder) {
      --cds-grid-bg: transparent;
      --cds-text-primary: var(--shade-10);
      --cds-text-secondary: var(--shade-300);
      // Match the 2024 template's body font instead of falling through to
      // Carbon's default Roboto.
      --cds-charts-font-family: "Spline Sans", Helvetica, Arial, sans-serif;
      --cds-charts-font-family-condensed:
        "Spline Sans", Helvetica, Arial, sans-serif;
    }

    // Area + line colors come from Carbon's getFillColor / getStrokeColor
    // callbacks (see options above), so we only need width + opacity here.
    :global(.area) {
      fill-opacity: 1;
    }

    :global(.line) {
      stroke-width: var(--ni-2);
    }

    // Hover marker for the active data point. Hidden by default (radius 7
    // is set via Carbon's points option but opacity stays 0 so the dots
    // are invisible). On `.hovered`, the dot fades and scales in to a
    // purple pin with a faint white halo.
    :global(circle.dot) {
      fill: var(--purple-500);
      stroke: var(--shade-10);
      stroke-width: var(--ni-2);
      fill-opacity: 0;
      stroke-opacity: 0;
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(0.4);
      transition:
        transform 80ms ease-out,
        fill-opacity 80ms ease-out,
        stroke-opacity 80ms ease-out;
    }

    :global(circle.dot.hovered) {
      fill-opacity: 1;
      stroke-opacity: 0.8;
      transform: scale(1);
    }

    :global(.tick line),
    :global(.domain) {
      stroke: transparent;
    }
  }

  // Carbon mounts the tooltip wrapper outside .cds--chart-holder, so the
  // YirTooltip styles can't reach it through the normal cascade. Flatten the
  // wrapper here so the (purple-pill) tooltip styling shows through cleanly.
  :global(.cds--cc--tooltip) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
</style>
