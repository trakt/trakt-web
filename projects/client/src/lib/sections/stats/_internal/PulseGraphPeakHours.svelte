<script lang="ts">
  import type { PeakHoursData } from "./models/PeakHoursData";

  const { data }: { data: PeakHoursData } = $props();

  const max = $derived(Math.max(...data.buckets.map((b) => b.count), 1));
</script>

<div class="graph-peak-hours">
  {#each data.buckets as bucket (bucket.label)}
    <div class="peak-row">
      <span class="peak-label tag">{bucket.label}</span>
      <div class="peak-bar-track">
        <div
          class="peak-bar-fill"
          style:width="{(bucket.count / max) * 100}%"
        ></div>
      </div>
      <span class="peak-count secondary tag">{bucket.count}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .graph-peak-hours {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
    justify-content: space-around;
  }

  .peak-row {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .peak-label {
    width: var(--ni-64);
    flex-shrink: 0;
    text-align: left;
  }

  .peak-bar-track {
    flex: 1;
    height: var(--ni-8);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-radius: var(--ni-4);
    overflow: hidden;
  }

  .peak-bar-fill {
    height: 100%;
    background: var(--purple-500);
    border-radius: var(--ni-4);
    min-width: 2px;
    transition: width var(--transition-increment) ease;
  }

  .peak-count {
    width: var(--ni-28);
    text-align: right;
    flex-shrink: 0;
  }
</style>
