<script lang="ts">
  import { slide } from "svelte/transition";

  type SyncProgressProps = {
    processedCount: number;
    totalCount: number;
    label: string;
  };

  const { processedCount, totalCount, label }: SyncProgressProps = $props();

  const percentage = $derived(
    totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0,
  );
</script>

<div class="sync-progress" transition:slide={{ duration: 150, axis: "y" }}>
  <p class="secondary">
    {label}
  </p>
  <div class="sync-progress-bar-track">
    <div
      class="sync-progress-bar-fill"
      style="width: {percentage}%"
      role="progressbar"
      aria-valuenow={processedCount}
      aria-valuemin={0}
      aria-valuemax={totalCount}
    ></div>
  </div>
</div>

<style>
  .sync-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .sync-progress-bar-track {
    height: var(--ni-6);
    border-radius: var(--border-radius-xs);
    background-color: color-mix(in srgb, var(--color-border) 50%, transparent);
    overflow: hidden;
  }

  .sync-progress-bar-fill {
    height: 100%;
    border-radius: var(--border-radius-xs);
    background-color: var(--color-background-purple);
    transition: width var(--transition-increment) ease-in-out;
  }
</style>
