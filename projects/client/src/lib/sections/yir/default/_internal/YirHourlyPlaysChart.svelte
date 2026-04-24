<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanHour } from "$lib/utils/formatting/date/toHumanHour";

  const { data }: { data: number[] } = $props();

  const labels = $derived.by(() => {
    const locale = languageTag();
    return Array.from({ length: 24 }, (_, hour) =>
      toHumanHour(new Date(2021, 0, 1, hour, 0), locale),
    );
  });

  function tooltipHTML({ index, value }: { index: number; value: number }) {
    const locale = languageTag();
    const start = toHumanClockTime(new Date(2021, 0, 1, index, 0), locale);
    const end = toHumanClockTime(new Date(2021, 0, 1, index, 59), locale);
    const timeRange = `${start} - ${end}`;
    return `
      <div class="bar-chart-tooltip">
        <div class="bar-chart-tooltip-primary">${value} ${value === 1 ? "play" : "plays"}</div>
        <div class="bar-chart-tooltip-secondary">${timeRange}</div>
      </div>
    `;
  }
</script>

<BarChart {data} {labels} {tooltipHTML} axisInset={86} />
