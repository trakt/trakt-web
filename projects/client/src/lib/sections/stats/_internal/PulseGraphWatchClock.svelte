<script lang="ts">
  import type { PulseGraphData } from "./pulseGraphs";

  const { data }: { data: PulseGraphData["watchClock"] } = $props();

  const max = $derived(
    Math.max(...data.buckets.map((b) => b.count), 1),
  );
</script>

<div class="graph-watch-clock">
  {#each data.buckets as bucket (bucket.label)}
    <div class="clock-row">
      <span class="clock-label">{bucket.label}</span>
      <div class="clock-bar-track">
        <div
          class="clock-bar-fill"
          style:width="{(bucket.count / max) * 100}%"
        ></div>
      </div>
      <span class="clock-count">{bucket.count}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .graph-watch-clock {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
    justify-content: center;
  }

  .clock-row {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .clock-label {
    font-size: var(--ni-11);
    color: var(--shade-400);
    width: var(--ni-72);
    flex-shrink: 0;
    text-align: right;
  }

  .clock-bar-track {
    flex: 1;
    height: var(--ni-6);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-radius: var(--ni-4);
    overflow: hidden;
  }

  .clock-bar-fill {
    height: 100%;
    background: var(--purple-500);
    border-radius: var(--ni-4);
    min-width: 2px;
  }

  .clock-count {
    font-size: var(--ni-11);
    color: var(--shade-600);
    width: var(--ni-28);
    text-align: right;
    flex-shrink: 0;
  }
</style>
