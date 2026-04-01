<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";
  import { setDay } from "date-fns/setDay";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const { data }: { data: number[] } = $props();

  const chartData = $derived.by(() => {
    const locale = getLocale();
    return data.map((value, index) => ({
      value,
      label: toHumanDayOfWeek(setDay(new Date(0), index), locale),
    }));
  });
</script>

<BarChart data={chartData}>
  {#snippet tooltip({ value, label })}
    <YirTooltip main="{value} {value === 1 ? 'play' : 'plays'}" sub={label} />
  {/snippet}
</BarChart>
