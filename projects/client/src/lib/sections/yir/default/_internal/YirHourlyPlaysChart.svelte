<script lang="ts">
  import BarChart from "$lib/components/charts/BarChart.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanHour } from "$lib/utils/formatting/date/toHumanHour";
  import { yirUnit } from "../../_internal/yirUnit.ts";
  import { setHours } from "date-fns/setHours";
  import { setMinutes } from "date-fns/setMinutes";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const { data }: { data: number[] } = $props();

  const chartData = $derived.by(() => {
    const locale = languageTag();
    return data.map((value, index) => ({
      value,
      label: toHumanHour(setHours(new Date(0), index), locale),
    }));
  });

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const tickLabels = $derived.by(() => {
    if (!$isMobile) return chartData.map((d) => d.label);
    return chartData.map((d, i) => (i % 6 === 0 ? d.label : ""));
  });
</script>

<BarChart data={chartData} {tickLabels}>
  {#snippet tooltip({ value, index })}
    {@const locale = languageTag()}
    {@const start = toHumanClockTime(setHours(new Date(0), index), locale)}
    {@const end = toHumanClockTime(
      setMinutes(setHours(new Date(0), index), 59),
      locale,
    )}
    <YirTooltip
      main="{value} {yirUnit(value, m.yir_unit_play, m.yir_unit_plays)}"
      sub="{start} - {end}"
    />
  {/snippet}
</BarChart>
