<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";

  type ImportProgressProps = {
    processedCount: number;
    totalCount: number;
  };

  const { processedCount, totalCount }: ImportProgressProps = $props();

  const percentage = $derived(
    totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0,
  );
</script>

<div class="import-progress" transition:slide={{ duration: 150, axis: "y" }}>
  <p class="secondary">
    {m.import_status_syncing({ processed: processedCount, total: totalCount })}
  </p>
  <div class="import-progress-bar-track">
    <div
      class="import-progress-bar-fill"
      style="width: {percentage}%"
      role="progressbar"
      aria-valuenow={processedCount}
      aria-valuemin={0}
      aria-valuemax={totalCount}
    ></div>
  </div>
</div>

<style>
  .import-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .import-progress-bar-track {
    height: var(--ni-6);
    border-radius: var(--border-radius-xs);
    background-color: color-mix(in srgb, var(--color-border) 50%, transparent);
    overflow: hidden;
  }

  .import-progress-bar-fill {
    height: 100%;
    border-radius: var(--border-radius-xs);
    background-color: var(--color-background-purple);
    transition: width var(--transition-increment) ease-in-out;
  }
</style>
