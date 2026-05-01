<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { ScaleTypes } from "@carbon/charts";
  import { BarChartSimple, type BarChartOptions } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import type { BarChartProps } from "./models/BarChartProps";

  const barSpacing = 2;

  const { data, tooltipHTML }: BarChartProps = $props();

  const values = $derived(data.map((d) => d.value));
  const labels = $derived(data.map((d) => d.label));

  const maxValue = $derived(Math.max(...values, 0));

  const { observedDimension, observeDimension } = useDimensionObserver(
    "width",
    time.fps(30),
  );

  const barWidth = $derived(
    data.length > 0
      ? Math.floor($observedDimension / data.length) - barSpacing
      : 0,
  );

  const options: BarChartOptions = $derived({
    axes: {
      left: { mapsTo: "value", visible: false },
      bottom: { mapsTo: "label", scaleType: ScaleTypes.LABELS },
    },
    grid: {
      x: { enabled: false },
      y: { enabled: false },
    },
    bars: { width: barWidth },
    legend: { enabled: false },
    toolbar: { enabled: false },
    tooltip: {
      enabled: tooltipHTML != null,
      customHTML: (points: Array<{ value: number; label: string }>) => {
        if (!tooltipHTML) return "";
        if (!points || points.length === 0) return "";
        const point = points[0];
        const index = labels.indexOf(point.label);
        return tooltipHTML({
          value: point.value,
          label: point.label,
          index,
        });
      },
    },
    resizable: false,
    width: `${$observedDimension}px`,
    height: "180px",
    getFillColor: (_, __, data) => {
      const barColor =
        data?.value === maxValue
          ? "var(--color-bar-custom-highlight, var(--color-bar-chart-bar-highlight))"
          : "var(--color-bar-custom-default, var(--color-bar-chart-bar-default))";

      return `var(--color-bar-hover, ${barColor})`;
    },
  });
</script>

<div class="trakt-bar-chart" use:observeDimension>
  <BarChartSimple {data} {options} />
</div>

<style lang="scss">
  .trakt-bar-chart {
    width: 100%;
    height: 100%;

    :global(.cds--chart-holder) {
      --cds-grid-bg: transparent;
      --cds-text-primary: var(
        --color-text-primary-override,
        var(--color-text-primary)
      );
      --cds-text-secondary: var(
        --color-text-secondary-override,
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
