<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import YirWeeklyPlaysChart from "../../_internal/YirWeeklyPlaysChart.svelte";

  const {
    data,
    year,
  }: {
    data: number[];
    year: number;
  } = $props();
</script>

<div class="trakt-yir-2024-weekly-plays-chart">
  <YirWeeklyPlaysChart {data} {year} barSpacing={1}>
    {#snippet tooltip({ value, week, dateRange })}
      <YirTooltip
        main={m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) })}
        sub={m.yir_2024_stats_tooltip_week_label({ week: String(week) })}
        extra={dateRange}
      />
    {/snippet}
  </YirWeeklyPlaysChart>
</div>

<style lang="scss">
  // Bars render through the shared --viz-* palette (theme-aware, peak-weighted
  // by the BarChart primitive); only the chart height is template-specific.
  .trakt-yir-2024-weekly-plays-chart {
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
