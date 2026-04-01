<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { addDays } from "date-fns/addDays";
  import { startOfYear } from "date-fns/startOfYear";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

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

  const chartData = $derived(
    data.map((value, index) => ({
      value,
      label: `${index + 1}`,
    })),
  );

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  const tickLabels = $derived.by(() => {
    if ($isDesktop) return chartData.map((d) => d.label);
    return chartData.map((d, i) => (i % 4 === 0 ? d.label : ""));
  });
</script>

<BarChart data={chartData} {tickLabels}>
  {#snippet tooltip({ value, label })}
    {@const weekNumber = parseInt(label, 10)}
    <YirTooltip
      main="{value} {value === 1 ? 'play' : 'plays'}"
      sub="Week {weekNumber}"
      extra={getWeekDateRange(weekNumber)}
    />
  {/snippet}
</BarChart>
