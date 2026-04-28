<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import type { PulseGraphData } from "./models/PulseGraphData";

  const { data }: { data: PulseGraphData["screenTimeDaily"] } = $props();

  const locale = getLocale();
  const lang = languageTag();

  function barColor(pct: number): string {
    if (pct >= 30) return "var(--orange-500)";
    if (pct >= 15) return "var(--yellow-500)";
    return "var(--green-500)";
  }

  function toCompactDuration(minutes: number): string {
    if (minutes <= 0) return "0m";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;

    return `${hours}h${mins}m`;
  }
</script>

<div class="graph-screen-time-daily">
  {#each data.labels as label, i (i)}
    {@const pct = data.percentages[i] ?? 0}
    {@const minutes = data.minutesPerDay[i] ?? 0}
    {@const isToday = label === m.text_stats_today()}
    <div class="screen-time-col">
      <div class="screen-time-track">
        <div
          class="screen-time-fill"
          class:is-today={isToday}
          style:height="{Math.min(pct, 100)}%"
          style:background={barColor(pct)}
          title="{toHumanDuration({ minutes }, lang)} · {toPercentage(
            pct / 100,
            locale,
          )}"
        ></div>
      </div>
      <span class="screen-time-value" title={toHumanDuration({ minutes }, lang)}>
        {toCompactDuration(minutes)}
      </span>
      <span class="screen-time-label">{label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .graph-screen-time-daily {
    display: flex;
    gap: var(--ni-8);
    flex: 1;
  }

  .screen-time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
    min-width: 0;
    justify-content: flex-end;
  }

  .screen-time-track {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .screen-time-fill {
    position: absolute;
    bottom: 0;
    left: 15%;
    right: 15%;
    border-radius: var(--ni-2);
    min-height: 1px;
    transition: height 0.3s ease;

    &.is-today {
      box-shadow: 0 0 var(--ni-6)
        color-mix(in srgb, currentColor 40%, transparent);
    }
  }

  .screen-time-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .screen-time-value {
    font-size: var(--ni-9);
    color: var(--shade-500);
    line-height: 1;
    font-weight: 600;
    white-space: nowrap;
  }
</style>
