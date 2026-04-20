<script lang="ts">
  import type { BarChartOptions } from "@carbon/charts";
  import { ScaleTypes } from "@carbon/charts";
  import { BarChartSimple } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { languageTag } from "$lib/features/i18n";
  import { findMaxIndex } from "$lib/utils/array/findMaxIndex";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";

  const {
    data,
  }: {
    data: number[];
  } = $props();

  let containerWidth = $state(575);
  let chartContainer: HTMLDivElement;

  const barWidth = $derived(Math.ceil((containerWidth - 50) / 12));

  $effect(() => {
    if (!chartContainer) return;
    const resizeObserver = new ResizeObserver((entries) => {
      containerWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(chartContainer);
    return () => resizeObserver.disconnect();
  });

  const monthNames = $derived.by(() => {
    const locale = languageTag();
    return Array.from({ length: 12 }, (_, i) =>
      toHumanMonth(new Date(2021, i, 1), locale, "short"),
    );
  });

  // Calculate max value index for coloring
  const maxIndex = $derived(findMaxIndex(data));

  // Transform data to Carbon Charts format with color mapping
  const chartData = $derived(
    data.map((value, index) => ({
      group: index === maxIndex ? "Max" : "Normal",
      key: monthNames[index],
      value: value,
    })),
  );

  const options = $derived<BarChartOptions>({
    title: "",
    theme: "g100",
    axes: {
      left: {
        visible: false,
      },
      bottom: {
        visible: true,
        mapsTo: "key",
        scaleType: ScaleTypes.LABELS,
        title: "",
      },
    },
    height: "180px",
    legend: {
      enabled: false,
    },
    toolbar: {
      enabled: false,
    },
    bars: {
      width: barWidth,
      spacingFactor: 0,
    },
    color: {
      scale: {
        Normal: "#999999",
        Max: "#ffffff",
      },
    },
    tooltip: {
      customHTML: (data: Array<{ value: number; key: string }>) => {
        if (!data || data.length === 0) return "";
        const point = data[0];
        const monthName = point.key;
        const plays = point.value;

        return `
          <div class="yir-chart-tooltip">
            <div class="yir-chart-tooltip-plays">${plays} ${plays === 1 ? "play" : "plays"}</div>
            <div class="yir-chart-tooltip-month">${monthName}</div>
          </div>
        `;
      },
    },
    grid: {
      x: {
        enabled: false,
      },
      y: {
        enabled: false,
      },
    },
  });
</script>

<div class="yir-monthly-chart" bind:this={chartContainer}>
  <BarChartSimple data={chartData} {options} />
</div>

<style lang="scss">
  .yir-monthly-chart {
    /* Component-specific styles can go here if needed */
  }
</style>
