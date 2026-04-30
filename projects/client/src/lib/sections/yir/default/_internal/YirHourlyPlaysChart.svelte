<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanHour } from "$lib/utils/formatting/date/toHumanHour";
  import { setHours } from "date-fns/setHours";
  import { setMinutes } from "date-fns/setMinutes";
  import { yirTooltipHTML } from "../../_internal/yirTooltipHTML.ts";

  const { data }: { data: number[] } = $props();

  function tooltipHTML({ index, value }: { index: number; value: number }) {
    const locale = languageTag();
    const start = toHumanClockTime(setHours(new Date(0), index), locale);
    const end = toHumanClockTime(
      setMinutes(setHours(new Date(0), index), 59),
      locale,
    );
    return yirTooltipHTML({
      main: `${value} ${value === 1 ? "play" : "plays"}`,
      sub: `${start} - ${end}`,
    });
  }

  const chartData = $derived.by(() => {
    const locale = languageTag();
    return data.map((value, index) => ({
      value,
      label: toHumanHour(setHours(new Date(0), index), locale),
    }));
  });
</script>

<BarChart data={chartData} {tooltipHTML} />
