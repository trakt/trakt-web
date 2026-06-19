<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const {
    data,
    month,
    year,
  }: {
    /** Plays per day-of-month (index 0 = the 1st). */
    data: number[];
    /** 1-12. */
    month: number;
    year: number;
  } = $props();

  const chartData = $derived(
    data.map((value, index) => ({ value, label: `${index + 1}` })),
  );

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);

  // Tick density steps down with viewport so 28-31 day labels never collide.
  // Desktop shows every day (matches the reference design); smaller screens
  // thin the labels out.
  const tickStep = $derived.by(() => {
    if ($isDesktop) return 1;
    if ($isTabletSmall) return 3;
    return 5;
  });

  const tickLabels = $derived(
    chartData.map((d, i) => (i % tickStep === 0 ? d.label : "")),
  );

  function dateLabel(day: number): string {
    return toHumanShortDate(new Date(year, month - 1, day), languageTag());
  }
</script>

<div class="trakt-yir-2024-daily-plays-chart">
  <BarChart data={chartData} {tickLabels} barSpacing={1}>
    {#snippet tooltip({ value, label })}
      {@const day = parseInt(label, 10)}
      <YirTooltip
        main={m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) })}
        sub={dateLabel(day)}
      />
    {/snippet}
  </BarChart>
</div>

<style lang="scss">
  // Matches Yir2024WeeklyPlaysChart's 2024 palette: light gray bars, peak day
  // in purple-300, hover purple-500.
  .trakt-yir-2024-daily-plays-chart {
    --color-bar-custom-default: var(--shade-100);
    --color-bar-custom-highlight: var(--purple-300);
    --color-bar-custom-hover: var(--purple-500);
    --height-bar-chart: var(--ni-300);
    width: 100%;

    :global(.cds--chart-holder) {
      --cds-charts-font-family: "Spline Sans", Helvetica, Arial, sans-serif;
      --cds-charts-font-family-condensed:
        "Spline Sans", Helvetica, Arial, sans-serif;
    }
  }
</style>
