<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
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

  function barColor(pct: number): string {
    if (pct >= 30) return "var(--orange-500)";
    if (pct >= 15) return "var(--yellow-500)";
    return "var(--green-500)";
  }
</script>

<div class="trakt-pulse-graph-screen-time-daily">
  {#each data.labels as label, i (i)}
    {@const pct = data.percentages[i] ?? 0}
    {@const minutes = data.minutesPerDay[i] ?? 0}
    {@const normalizedPct = (pct / maxPct) * 100}
    <div class="screen-time-column">
      <div class="screen-time-bar-container">
        <div
          class="screen-time-fill"
          style:height="{normalizedPct}%"
          style:background={barColor(pct)}
          title="{toHumanDuration({ minutes }, lang)} · {toPercentage(
            pct / 100,
            locale,
          )}"
        >
          <span
            class="screen-time-value tag secondary no-wrap"
            title={toHumanDuration({ minutes }, lang)}
          >
            {toHumanDuration({ minutes, separator: "" }, lang) || zeroMinutes}
          </span>
        </div>
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

    padding-top: var(--ni-16);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .screen-time-fill {
    position: relative;

    width: 100%;
    min-height: 2px;

    border-radius: var(--ni-4) var(--ni-4) 0 0;

    transition: var(--transition-increment) ease;
    transition-property: height, background;
  }

  .screen-time-label {
    width: 100%;
    text-align: center;
  }

  .screen-time-value {
    position: absolute;

    bottom: calc(100% + var(--ni-4));
    left: 0;
    right: 0;

    text-align: center;
  }
</style>
