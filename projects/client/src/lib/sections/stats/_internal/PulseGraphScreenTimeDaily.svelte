<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
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
    <div class="screen-time-row">
      <span class="screen-time-label">{label}</span>
      <div class="screen-time-track">
        <div
          class="screen-time-fill"
          style:width="{Math.min(pct, 100)}%"
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
    </div>
  {/each}
</div>

<style lang="scss">
  .graph-screen-time-daily {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
    justify-content: center;
  }

  .screen-time-row {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .screen-time-track {
    flex: 1;
    min-width: 0;
    height: var(--ni-6);
    border-radius: var(--ni-4);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .screen-time-fill {
    height: 100%;
    border-radius: var(--ni-4);
    min-width: 2px;
    transition: width 0.3s ease;
  }

  .screen-time-label {
    font-size: var(--ni-11);
    color: var(--shade-400);
    line-height: 1;
    width: var(--ni-72);
    flex-shrink: 0;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .screen-time-value {
    font-size: var(--ni-11);
    color: var(--shade-600);
    line-height: 1;
    font-weight: 500;
    white-space: nowrap;
    width: var(--ni-44);
    text-align: right;
    flex-shrink: 0;
  }
</style>
