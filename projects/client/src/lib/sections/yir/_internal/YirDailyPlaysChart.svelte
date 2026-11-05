<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";
  import { toLocaleWeekdays } from "./toLocaleWeekdays.ts";
  import { yirUnit } from "./yirUnit.ts";
  import YirTooltip from "./YirTooltip.svelte";

  const { data }: { data: number[] } = $props();

  const chartData = $derived.by(() => {
    const locale = getLocale();
    return toLocaleWeekdays(data, locale).map(({ value, date }) => ({
      value,
      label: toHumanDayOfWeek(date, locale),
    }));
  });
</script>

<BarChart data={chartData}>
  {#snippet tooltip({ value, label })}
    <YirTooltip
      main="{value} {yirUnit(value, m.yir_unit_play, m.yir_unit_plays)}"
      sub={label}
    />
  {/snippet}
</BarChart>
