<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { time } from "$lib/utils/timing/time";
  import { ScaleTypes } from "@carbon/charts";
  import { BarChartSimple, type BarChartOptions } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { flushSync } from "svelte";
  import type { BarChartProps, TooltipArgs } from "./models/BarChartProps";

  const barSpacing = 2;
  const chartPaddingVar = "var(--ni-12)";

  const { data, tooltip, tickLabels }: BarChartProps = $props();

  // Carbon Charts keys bars by `group`; remap label → group so D3 join is stable on resize.
  const carbonData = $derived(
    data.map((d) => ({ group: d.label, value: d.value })),
  );

  const values = $derived(data.map((d) => d.value));
  const labels = $derived(data.map((d) => d.label));

  const maxValue = $derived(Math.max(...values, 0));

  const chartPadding = useVarToPixels(chartPaddingVar);
  const { observedDimension: observedContainerDimension, observeDimension } =
    useDimensionObserver("width", time.fps(30));

  const observedDimension = $derived(
    $observedContainerDimension - $chartPadding * 2,
  );

  const barWidth = $derived(
    data.length > 0
      ? Math.floor(observedDimension / data.length) - barSpacing
      : 0,
  );

  const getFillColor = $derived(
    (_: unknown, __: unknown, data: { value: number } | undefined) => {
      const barColor =
        data?.value === maxValue
          ? "var(--color-bar-custom-highlight, var(--color-bar-chart-bar-highlight))"
          : "var(--color-bar-custom-default, var(--color-bar-chart-bar-default))";

      return `var(--color-bar-hover, ${barColor})`;
    },
  );

  let tooltipContainer: HTMLDivElement | undefined = $state();
  let tooltipArgs: TooltipArgs | null = $state(null);

  const customHTML = $derived(
    (points: Array<{ value: number; group: string }>) => {
      if (!tooltip || !tooltipContainer) return "";
      if (!points?.length) return "";
      const point = points[0];
      const index = labels.indexOf(point.group);
      tooltipArgs = { value: point.value, label: point.group, index };
      flushSync();
      return tooltipContainer.innerHTML;
    },
  );

  const options: BarChartOptions = $derived({
    axes: {
      left: { mapsTo: "value", visible: false },
      bottom: {
        mapsTo: "group",
        scaleType: ScaleTypes.LABELS,
        ticks: tickLabels ? { values: tickLabels } : undefined,
      },
    },
    grid: {
      x: { enabled: false },
      y: { enabled: false },
    },
    bars: { width: barWidth },
    legend: { enabled: false },
    toolbar: { enabled: false },
    tooltip: {
      enabled: tooltip != null,
      customHTML,
    },
    resizable: false,
    width: `${observedDimension}px`,
    height: "var(--height-bar-chart)",
    getFillColor,
  });
</script>

<div
  class="trakt-bar-chart"
  use:observeDimension
  style="--chart-padding: {$chartPadding}px"
>
  <BarChartSimple data={carbonData} {options} />

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
  .trakt-bar-chart {
    width: 100%;
    height: 100%;
    overflow: hidden;

    padding: var(--chart-padding);
    box-sizing: border-box;

    :global(.cds--chart-holder) {
      --cds-grid-bg: transparent;
      --cds-text-primary: var(
        --color-bar-chart-text-primary,
        var(--color-text-primary)
      );
      --cds-text-secondary: var(
        --color-bar-chart-text-secondary,
        var(--color-text-secondary)
      );
      --cds-charts-font-family: "Roboto", Arial, sans-serif;
      --cds-charts-font-family-condensed: "Roboto", Arial, sans-serif;
    }

    :global(.bar) {
      transition: fill var(--transition-increment) ease-in-out;
    }

    :global(.bar:hover) {
      --color-bar-hover: var(
        --color-bar-custom-hover,
        var(--color-bar-chart-bar-hover)
      );
    }
  }

  // Carbon renders its tooltip wrapper outside the chart-holder DOM, so its
  // `--cds-layer-02` background and hardcoded box-shadow can't be reached
  // through CSS-variable cascade. These overrides flatten the wrapper so the
  // YirTooltip styling shows through cleanly.
  :global(.cds--cc--tooltip) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
</style>
