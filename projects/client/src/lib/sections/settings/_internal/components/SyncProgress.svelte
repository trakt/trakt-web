<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { slide } from "svelte/transition";

  type SyncProgressProps = {
    processedCount: number;
    totalCount: number;
    label: string;
  };

  const { processedCount, totalCount, label }: SyncProgressProps = $props();

  const fraction = $derived(
    ratio({ value: processedCount, total: totalCount }),
  );
</script>

<div class="trakt-sync-progress" transition:slide={{ duration: 150, axis: "y" }}>
  <p class="secondary">
    {label}
  </p>
  <DistributionBar
    {fraction}
    color="var(--color-background-purple)"
    label={label}
    --distribution-bar-track="color-mix(in srgb, var(--color-border) 50%, transparent)"
  />
</div>

<style>
  .trakt-sync-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
