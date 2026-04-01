<script lang="ts">
  import type { BarChartOptions } from "@carbon/charts";
  import { ScaleTypes } from "@carbon/charts";
  import { BarChartSimple } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { languageTag } from "$lib/features/i18n";
  import { findMaxIndex } from "$lib/utils/array/findMaxIndex";

  const {
    data,
  }: {
    data: number[];
  } = $props();

  let containerWidth = $state(1170);
  let chartContainer: HTMLDivElement;

  const barWidth = $derived(Math.ceil((containerWidth - 86) / 24));

  $effect(() => {
    if (!chartContainer) return;
    const resizeObserver = new ResizeObserver((entries) => {
      containerWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(chartContainer);
    return () => resizeObserver.disconnect();
  });

  // Generate localized hour labels using Intl API
  const hourLabels = $derived.by(() => {
    const locale = languageTag();
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: undefined, // Let locale decide 12h vs 24h
    });

    return Array.from({ length: 24 }, (_, hour) => {
      const date = new Date(2021, 0, 1, hour, 0);
      return formatter.format(date);
    });
  });

  // Calculate max value index for coloring
  const maxIndex = $derived(findMaxIndex(data));

  // Transform data to Carbon Charts format with color mapping
  const chartData = $derived(
    data.map((value, index) => ({
      group: index === maxIndex ? "Max" : "Normal",
      key: hourLabels[index],
      value: value,
    })),
  );

  // Format time range for tooltip using Intl API
  function getTimeRange(hour: number): string {
    const locale = languageTag();
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: undefined, // Let locale decide 12h vs 24h
    });

    const startDate = new Date(2021, 0, 1, hour, 0);
    const endDate = new Date(2021, 0, 1, hour, 59);

    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
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
        const hourIndex = hourLabels.indexOf(point.key);
        const timeRange = getTimeRange(hourIndex);
        const plays = point.value;

        return `
          <div class="yir-chart-tooltip">
            <div class="yir-chart-tooltip-plays">${plays} ${plays === 1 ? "play" : "plays"}</div>
            <div class="yir-chart-tooltip-time">${timeRange}</div>
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

<div class="yir-hourly-chart" bind:this={chartContainer}>
  <BarChartSimple data={chartData} {options} />
</div>

<style lang="scss">
  .yir-hourly-chart {
    /* Component-specific styles can go here if needed */
  }
</style>
