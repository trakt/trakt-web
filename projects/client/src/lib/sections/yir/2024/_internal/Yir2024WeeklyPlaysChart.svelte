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
  // 2024 palette: bars use the lightest cool gray (shade-100, exactly
  // matches v2's #d2d6d9); peak week pops in the lighter purple-300, and
  // hover lands on purple-500 (#9f42c6, exactly matches v2's hover).
  .trakt-yir-2024-weekly-plays-chart {
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
