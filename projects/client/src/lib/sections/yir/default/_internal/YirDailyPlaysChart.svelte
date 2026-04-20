<script lang="ts">
  import type { BarChartOptions } from "@carbon/charts";
  import { ScaleTypes } from "@carbon/charts";
  import { BarChartSimple } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { getLocale } from "$lib/features/i18n";
  import { findMaxIndex } from "$lib/utils/array/findMaxIndex";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";

  const {
    data,
  }: {
    data: number[];
  } = $props();

  let containerWidth = $state(575);
  let chartContainer: HTMLDivElement;

  const barWidth = $derived(Math.ceil((containerWidth - 25) / 7));

  $effect(() => {
    if (!chartContainer) return;
    const resizeObserver = new ResizeObserver((entries) => {
      containerWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(chartContainer);
    return () => resizeObserver.disconnect();
  });

  const dayNames = $derived.by(() => {
    const locale = getLocale();
    // January 3, 2021 was a Sunday, so we use it as a base.
    return Array.from({ length: 7 }, (_, i) =>
      toHumanDayOfWeek(new Date(2021, 0, 3 + i), locale),
    );
  });

  // Calculate max value index for coloring
  const maxIndex = $derived(findMaxIndex(data));

  // Transform data to Carbon Charts format with color mapping
  const chartData = $derived(
    data.map((value, index) => ({
      group: index === maxIndex ? "Max" : "Normal",
      key: dayNames[index],
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
        const dayName = point.key;
        const plays = point.value;

        return `
          <div class="yir-chart-tooltip">
            <div class="yir-chart-tooltip-plays">${plays} ${plays === 1 ? "play" : "plays"}</div>
            <div class="yir-chart-tooltip-day">${dayName}</div>
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

<div class="yir-daily-chart" bind:this={chartContainer}>
  <BarChartSimple data={chartData} {options} />
</div>

<style lang="scss">
  .yir-daily-chart {
    /* Component-specific styles can go here if needed */
  }
</style>
