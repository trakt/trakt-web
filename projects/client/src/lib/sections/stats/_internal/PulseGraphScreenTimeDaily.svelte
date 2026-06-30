<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import type { ScreenTimeDailyData } from "./models/ScreenTimeDailyData";

  const { data }: { data: ScreenTimeDailyData } = $props();

  const locale = $derived(getLocale());
  const lang = $derived(languageTag());

  const maxPct = $derived(Math.max(...data.percentages, 1));

  const zeroMinutes = $derived(
    new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "minute",
      unitDisplay: "narrow",
    }).format(0),
  );

  // Sequential brand-purple intensity ramp (light -> deep = more screen time),
  // premium and on-brand rather than a traffic-light rainbow.
  function barColor(pct: number): string {
    if (pct >= 30) return "var(--viz-5)";
    if (pct >= 15) return "var(--viz-1)";
    return "var(--viz-3)";
  }
</script>

<div class="trakt-pulse-graph-screen-time-daily">
  {#each data.labels as label, i (i)}
    {@const pct = data.percentages[i] ?? 0}
    {@const minutes = data.minutesPerDay[i] ?? 0}
    {@const fraction = ratio({ value: pct, total: maxPct })}
    <div class="screen-time-column">
      <span class="screen-time-value tag secondary no-wrap">
        {toHumanDuration({ minutes, separator: "" }, lang) || zeroMinutes}
      </span>
      <div
        class="screen-time-bar-container"
        title="{toHumanDuration({ minutes }, lang)} · {toPercentage(
          pct / 100,
          locale,
        )}"
      >
        <DistributionBar
          orientation="vertical"
          {fraction}
          color={barColor(pct)}
          index={i}
          minVisible={0.03}
          label="{label}: {toHumanDuration({ minutes }, lang)}"
          --distribution-bar-thickness="64%"
        />
      </div>
      <span class="screen-time-label tag ellipsis no-wrap">{label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .trakt-pulse-graph-screen-time-daily {
    display: flex;
    gap: var(--ni-8);

    flex: 1;
  }

  .screen-time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-4);

    flex: 1;
    min-width: 0;
  }

  .screen-time-bar-container {
    width: 100%;
    height: var(--ni-80);
    box-sizing: border-box;

    // Center the single vertical bar within the column slot.
    display: flex;
    justify-content: center;
  }

  .screen-time-label {
    width: 100%;
    text-align: center;
  }

  // Aligned across all columns at the top of the chart, above every bar.
  .screen-time-value {
    width: 100%;
    text-align: center;
  }
</style>
