<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphData } from "./pulseGraphs";

  const { data }: { data: PulseGraphData["ratingsDistribution"] } = $props();

  const max = $derived(Math.max(...data.buckets, 1));
  const avg = $derived(data.average.toFixed(1));

  const ratingColors: readonly string[] = [
    "var(--red-500)",
    "var(--red-400)",
    "var(--orange-500)",
    "var(--orange-400)",
    "var(--purple-500)",
    "var(--purple-400)",
    "var(--green-500)",
    "var(--green-400)",
    "var(--blue-500)",
    "var(--blue-400)",
  ];
</script>

<div class="graph-ratings-dist">
  <div class="ratings-avg">
    <span class="ratings-avg-label">{m.label_stats_average()}</span>
    <span class="ratings-avg-value">{avg} ★</span>
  </div>
  <div class="ratings-bars">
    {#each { length: 10 } as _, i (i)}
      {@const score = i + 1}
      {@const count = data.buckets[i] ?? 0}
      {@const isPeak = count === max && count > 0}
      <div class="rating-bar-col" class:is-peak={isPeak}>
        <div class="rating-bar-track">
          <div
            class="rating-bar-fill"
            style:height="{max > 0 ? (count / max) * 100 : 0}%"
            style:background={ratingColors[i]}
          ></div>
        </div>
        <span class="rating-score">{score}</span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .graph-ratings-dist {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
  }

  .ratings-avg {
    display: flex;
    align-items: baseline;
    gap: var(--ni-8);
    justify-content: flex-end;
    line-height: 1;
  }

  .ratings-avg-label {
    font-size: var(--ni-10);
    color: var(--shade-600);
  }

  .ratings-avg-value {
    font-size: var(--ni-14);
    color: var(--shade-300);
    font-weight: 600;
  }

  .ratings-bars {
    display: flex;
    gap: var(--ni-4);
    flex: 1;
  }

  .rating-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    flex: 1;
    min-width: 0;
    justify-content: flex-end;
  }

  .rating-bar-track {
    width: 100%;
    flex: 1;
    position: relative;
    border-radius: var(--ni-2);
  }

  .rating-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: var(--ni-2);
    min-height: 1px;
  }

  .rating-score {
    font-size: var(--ni-10);
    color: var(--shade-500);
    line-height: 1;
  }

  .rating-bar-col.is-peak .rating-score {
    color: var(--shade-200);
    font-weight: 600;
  }
</style>
