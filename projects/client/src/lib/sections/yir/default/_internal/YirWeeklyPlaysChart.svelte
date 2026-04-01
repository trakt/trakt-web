<script lang="ts">
  import type { BarChartOptions } from "@carbon/charts";
  import { ScaleTypes } from "@carbon/charts";
  import { BarChartSimple } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { languageTag } from "$lib/features/i18n";
  import { findMaxIndex } from "$lib/utils/array/findMaxIndex";

  const {
    data,
    year,
  }: {
    data: number[];
    year: number;
  } = $props();

  let containerWidth = $state(1000);
  let chartContainer: HTMLDivElement;

  const barWidth = $derived(Math.ceil((containerWidth - 185) / 52));

  $effect(() => {
    if (!chartContainer) return;
    const resizeObserver = new ResizeObserver((entries) => {
      containerWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(chartContainer);
    return () => resizeObserver.disconnect();
  });

  // Calculate max value index for coloring
  const maxIndex = $derived(findMaxIndex(data));

  // Transform data to Carbon Charts format with color mapping
  const chartData = $derived(
    data.map((value, index) => ({
      group: index === maxIndex ? "Max" : "Normal",
      key: `${index + 1}`,
      value: value,
    })),
  );

  // Get week date range for tooltip
  function getWeekDateRange(weekNumber: number): string {
    const firstDay = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const weekStart = new Date(firstDay);
    weekStart.setDate(firstDay.getDate() + daysOffset);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date: Date) => {
      const month = date.toLocaleString(languageTag(), { month: "short" });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  }

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
        const weekNumber = parseInt(point.key, 10);
        const dateRange = getWeekDateRange(weekNumber);
        const plays = point.value;

        return `
          <div class="yir-chart-tooltip">
            <div class="yir-chart-tooltip-plays">${plays} ${plays === 1 ? "play" : "plays"}</div>
            <div class="yir-chart-tooltip-week">Week ${weekNumber}</div>
            <div class="yir-chart-tooltip-dates">${dateRange}</div>
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

<div class="yir-weekly-chart" bind:this={chartContainer}>
  <BarChartSimple data={chartData} {options} />
</div>

<style lang="scss">
  .yir-weekly-chart {
    min-width: 1000px;
  }
</style>
