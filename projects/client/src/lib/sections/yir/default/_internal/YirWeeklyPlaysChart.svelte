<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { addDays } from "date-fns/addDays";
  import { startOfYear } from "date-fns/startOfYear";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const {
    data,
    year,
  }: {
    data: number[];
    year: number;
  } = $props();

  function getWeekDateRange(weekNumber: number): string {
    const locale = languageTag();
    const weekStart = addDays(
      startOfYear(new Date(year, 0, 1)),
      (weekNumber - 1) * 7,
    );
    const weekEnd = addDays(weekStart, 6);

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

  const chartData = $derived(
    data.map((value, index) => ({
      value,
      label: `${index + 1}`,
    })),
  );
</script>

<BarChart data={chartData} {tooltipHTML} />
