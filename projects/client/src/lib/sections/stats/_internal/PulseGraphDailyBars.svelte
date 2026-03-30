<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphData } from "./pulseGraphs";

  const { data }: { data: PulseGraphData["dailyBars"] } = $props();

  const max = $derived(Math.max(...data.days, 1));
</script>

<div class="graph-daily-bars">
  {#each data.labels as label, i (i)}
    {@const barPct = max > 0 ? ((data.days[i] ?? 0) / max) * 100 : 0}
    {@const isToday = label === m.text_stats_today()}
    <div class="daily-bar-col">
      <div class="daily-bar-track">
        <div
          class="daily-bar-fill"
          class:is-today={isToday}
          style:height="{barPct}%"
        ></div>
      </div>
      <span class="daily-bar-label">{label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .graph-daily-bars {
    display: flex;
    gap: var(--ni-8);
    flex: 1;
  }

  .daily-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
    min-width: 0;
    justify-content: flex-end;
  }

  .daily-bar-track {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .daily-bar-fill {
    position: absolute;
    bottom: 0;
    left: 15%;
    right: 15%;
    background: var(--purple-500);
    border-radius: var(--ni-2);
    min-height: 1px;

    &.is-today {
      background: var(--purple-400);
      box-shadow: 0 0 var(--ni-6)
        color-mix(in srgb, var(--purple-400) 40%, transparent);
    }
  }

  .daily-bar-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
</style>
