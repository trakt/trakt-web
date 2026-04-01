<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const { data }: { data: number[] } = $props();

  const labels = $derived.by(() => {
    const locale = languageTag();
    return Array.from({ length: 12 }, (_, i) =>
      toHumanMonth(new Date(2021, i, 1), locale, "short"),
    );
  });

  function tooltipHTML({ value, label }: { value: number; label: string }) {
    return yirTooltipHTML({
      main: `${value} ${value === 1 ? "play" : "plays"}`,
      sub: label,
    });
  }
</script>

<BarChart {data} {labels} {tooltipHTML} />
