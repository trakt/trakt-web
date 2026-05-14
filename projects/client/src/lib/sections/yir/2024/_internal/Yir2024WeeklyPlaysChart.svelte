<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { m } from "$lib/paraglide/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber";
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

<div class="yir-2024-weekly-chart">
  <BarChart data={chartData} {tickLabels} barSpacing={1}>
    {#snippet tooltip({ value, label })}
      {@const weekNumber = parseInt(label, 10)}
      <YirTooltip
        main={m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) })}
        sub={m.yir_2024_stats_tooltip_week_label({ week: label })}
        extra={getWeekDateRange(weekNumber)}
      />
    {/snippet}
  </BarChart>
</div>

<style lang="scss">
  // 2024 palette: bars use the lightest cool gray (shade-100, exactly
  // matches v2's #d2d6d9); peak week pops in the lighter purple-300, and
  // hover lands on purple-500 (#9f42c6, exactly matches v2's hover).
  .yir-2024-weekly-chart {
    --color-bar-custom-default: var(--shade-100);
    --color-bar-custom-highlight: var(--purple-300);
    --color-bar-custom-hover: var(--purple-500);
    --height-bar-chart: var(--ni-300);
    width: 100%;

    // Match the 2024 template's body font; the shared BarChart wrapper
    // defaults to Roboto otherwise.
    :global(.cds--chart-holder) {
      --cds-charts-font-family: "Spline Sans", Helvetica, Arial, sans-serif;
      --cds-charts-font-family-condensed:
        "Spline Sans", Helvetica, Arial, sans-serif;
    }
  }
</style>
