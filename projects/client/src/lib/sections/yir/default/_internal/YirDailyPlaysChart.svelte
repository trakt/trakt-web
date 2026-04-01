<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const { data }: { data: number[] } = $props();

  const labels = $derived.by(() => {
    const locale = getLocale();
    // January 3, 2021 was a Sunday, so we use it as a base.
    return Array.from({ length: 7 }, (_, i) =>
      toHumanDayOfWeek(new Date(2021, 0, 3 + i), locale),
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
