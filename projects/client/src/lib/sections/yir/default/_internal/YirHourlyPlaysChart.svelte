<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanHour } from "$lib/utils/formatting/date/toHumanHour";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const { data }: { data: number[] } = $props();

  const labels = $derived.by(() => {
    const locale = languageTag();
    return Array.from({ length: 24 }, (_, hour) =>
      toHumanHour(new Date(2021, 0, 1, hour, 0), locale),
    );
  });

  function tooltipHTML({ index, value }: { index: number; value: number }) {
    const locale = languageTag();
    const start = toHumanClockTime(new Date(2021, 0, 1, index, 0), locale);
    const end = toHumanClockTime(new Date(2021, 0, 1, index, 59), locale);
    return yirTooltipHTML({
      main: `${value} ${value === 1 ? "play" : "plays"}`,
      sub: `${start} - ${end}`,
    });
  }
</script>

<BarChart {data} {labels} {tooltipHTML} />
