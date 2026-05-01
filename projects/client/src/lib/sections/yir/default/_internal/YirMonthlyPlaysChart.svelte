<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { setMonth } from "date-fns/setMonth";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const { data }: { data: number[] } = $props();

  function tooltipHTML({ value, label }: { value: number; label: string }) {
    return yirTooltipHTML({
      main: `${value} ${value === 1 ? "play" : "plays"}`,
      sub: label,
    });
  }

  const chartData = $derived.by(() => {
    const locale = languageTag();
    return data.map((value, index) => ({
      value,
      label: toHumanMonth(setMonth(new Date(0), index), locale, "short"),
    }));
  });
</script>

<BarChart data={chartData} {tooltipHTML} />
