<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { setMonth } from "date-fns/setMonth";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const { data }: { data: number[] } = $props();

  const chartData = $derived.by(() => {
    const locale = languageTag();
    return data.map((value, index) => ({
      value,
      label: toHumanMonth(setMonth(new Date(0), index), locale, "short"),
    }));
  });
</script>

<BarChart data={chartData}>
  {#snippet tooltip({ value, label })}
    <YirTooltip main="{value} {value === 1 ? 'play' : 'plays'}" sub={label} />
  {/snippet}
</BarChart>
