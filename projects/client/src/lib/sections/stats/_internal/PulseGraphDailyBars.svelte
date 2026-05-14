<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphData } from "./models/PulseGraphData";

  const { data }: { data: PulseGraphData["dailyBars"] } = $props();

  const max = $derived(Math.max(...data.days, 1));
</script>

<div class="graph-daily-bars">
  {#each data.labels as label, i (i)}
    {@const value = data.days[i] ?? 0}
    {@const barPct = max > 0 ? (value / max) * 100 : 0}
    {@const isMax = value === max && value > 0}
    {@const displayLabel = label.charAt(0).toUpperCase()}

    <div class="daily-bar-col">
      <span class="daily-bar-value" class:is-highlight={isMax}>
        {value > 0 ? value : ""}
      </span>
      <div class="daily-bar-track">
        <div
          class="daily-bar-fill"
          class:is-highlight={isMax}
          style:height="{barPct}%"
        ></div>
      </div>
      <span class="daily-bar-label">{displayLabel}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .graph-daily-bars {
    display: flex;
    gap: var(--ni-8);
    flex: 1;
    align-items: flex-end;
    padding-bottom: var(--ni-4);
  }

  .daily-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
    min-width: 0;
    height: 100%;
  }

  .daily-bar-value {
    font-size: var(--ni-10);
    font-weight: 600;
    color: var(--shade-600);
    height: var(--ni-12);
    line-height: 1.2;

    &.is-highlight {
      color: var(--color-white);
    }
  }

  .daily-bar-track {
    position: relative;
    width: var(--ni-24);
    flex: 1;
    display: flex;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--ni-4) var(--ni-4) 0 0;
  }

  .daily-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #333; // Default grey for bars
    border-radius: var(--ni-4) var(--ni-4) 0 0;
    min-height: 1px;
    transition: height 0.3s ease-out;

    &.is-highlight {
      background: var(--purple-500);
    }
  }

  .daily-bar-label {
    font-size: var(--ni-11);
    font-weight: 500;
    color: var(--shade-600);
    line-height: 1;
    margin-top: var(--ni-4);
  }
</style>

