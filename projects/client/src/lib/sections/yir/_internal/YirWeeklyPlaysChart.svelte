<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { addDays } from "date-fns/addDays";
  import { startOfYear } from "date-fns/startOfYear";
  import type { Snippet } from "svelte";

  type WeekTooltipArgs = {
    value: number;
    week: number;
    dateRange: string;
  };

  const {
    data,
    year,
    barSpacing = 2,
    tooltip: tooltipSnippet,
  }: {
    data: number[];
    year: number;
    /** Pixel gap between bars. Defaults to 2px. */
    barSpacing?: number;
    /**
     * Receives the resolved week info so consumers can localize / style the
     * tooltip without re-implementing the date-range math.
     */
    tooltip: Snippet<[WeekTooltipArgs]>;
  } = $props();

  function getWeekDateRange(weekNumber: number): string {
    const locale = languageTag();
    const weekStart = addDays(
      startOfYear(new Date(year, 0, 1)),
      (weekNumber - 1) * 7,
    );
    const weekEnd = addDays(weekStart, 6);
    return `${toHumanShortDate(weekStart, locale)} - ${
      toHumanShortDate(weekEnd, locale)
    }`;
  }

  const chartData = $derived(
    data.map((value, index) => ({
      value,
      label: `${index + 1}`,
    })),
  );

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);

  // Tick density steps down with viewport so 52-53 week labels never collide.
  // Even at full desktop width every-other looks cleaner than every label.
  //   desktop ≥1024      → every 2nd
  //   tablet-lg 769-1023 → every 4th
  //   tablet-sm 481-768  → every 8th
  //   mobile  ≤480       → every 12th
  const tickStep = $derived.by(() => {
    if ($isDesktop) return 2;
    if ($isTabletLarge) return 4;
    if ($isTabletSmall) return 8;
    return 12;
  });

  const tickLabels = $derived(
    chartData.map((d, i) => (i % tickStep === 0 ? d.label : "")),
  );
</script>

<BarChart data={chartData} {tickLabels} {barSpacing}>
  {#snippet tooltip({ value, label })}
    {@const week = parseInt(label, 10)}
    {@render tooltipSnippet({
      value,
      week,
      dateRange: getWeekDateRange(week),
    })}
  {/snippet}
</BarChart>
