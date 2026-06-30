<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import type { PeakHoursData } from "./models/PeakHoursData";

  const { data }: { data: PeakHoursData } = $props();

  const max = $derived(Math.max(...data.buckets.map((b) => b.count), 1));
</script>

<div class="trakt-pulse-graph-peak-hours">
  {#each data.buckets as bucket, i (bucket.key)}
    <div class="peak-row">
      <span class="peak-label tag">{bucket.label}</span>
      <div class="peak-bar">
        <DistributionBar
          fraction={ratio({ value: bucket.count, total: max })}
          index={i}
          active={bucket.count === max && bucket.count > 0}
          label="{bucket.label}: {bucket.count}"
        />
      </div>
      <span class="peak-count secondary tag">{bucket.count}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .trakt-pulse-graph-peak-hours {
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
    text-align: start;
  }

  .peak-bar {
    flex: 1;
  }

  .peak-count {
    width: var(--ni-28);
    text-align: end;
    flex-shrink: 0;
  }
</style>
