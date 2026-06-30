<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import YirWeeklyPlaysChart from "../../_internal/YirWeeklyPlaysChart.svelte";
  import { yirUnit } from "../../_internal/yirUnit.ts";

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
      main="{value} {yirUnit(value, m.yir_unit_play, m.yir_unit_plays)}"
      sub={m.yir_label_week_number({ weekNumber: week })}
      extra={dateRange}
    />
  {/snippet}
</YirWeeklyPlaysChart>
