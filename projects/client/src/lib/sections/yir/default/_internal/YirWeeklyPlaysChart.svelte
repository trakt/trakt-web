<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const {
    data,
    year,
  }: {
    data: number[];
    year: number;
  } = $props();

  const labels = $derived(Array.from({ length: 52 }, (_, i) => `${i + 1}`));

  function getWeekDateRange(weekNumber: number): string {
    const locale = languageTag();
    const firstDay = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;

    const weekStart = new Date(firstDay);
    weekStart.setDate(firstDay.getDate() + daysOffset);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return `${toHumanShortDate(weekStart, locale)} - ${toHumanShortDate(weekEnd, locale)}`;
  }

  function tooltipHTML({ value, label }: { value: number; label: string }) {
    const weekNumber = parseInt(label, 10);
    return yirTooltipHTML({
      main: `${value} ${value === 1 ? "play" : "plays"}`,
      sub: `Week ${weekNumber}`,
      extra: getWeekDateRange(weekNumber),
    });
  }
</script>

<BarChart {data} {labels} {tooltipHTML} />
