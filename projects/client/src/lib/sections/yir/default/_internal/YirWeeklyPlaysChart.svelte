<script lang="ts">
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

<YirWeeklyPlaysChart {data} {year}>
  {#snippet tooltip({ value, week, dateRange })}
    <YirTooltip
      main="{value} {value === 1 ? 'play' : 'plays'}"
      sub="Week {week}"
      extra={dateRange}
    />
  {/snippet}
</YirWeeklyPlaysChart>
