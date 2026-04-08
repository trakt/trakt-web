<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";

  type ImportCompleteProps = {
    processedCount: number;
    errorCount: number;
    onreset: () => void;
  };

  const { processedCount, errorCount, onreset }: ImportCompleteProps = $props();

  const successCount = $derived(processedCount - errorCount);
</script>

<div class="import-complete" transition:slide={{ duration: 150, axis: "y" }}>
  <div class="import-complete-summary">
    <p class="secondary">
      {m.import_complete_synced({ count: successCount })}
    </p>
    {#if errorCount > 0}
      <p class="secondary">
        {m.import_complete_errors({ count: errorCount })}
      </p>
    {/if}
  </div>
  <div class="import-complete-actions">
    <Button
      label={m.button_label_import_more()}
      onclick={onreset}
      color="default"
      size="small"
    >
      {m.button_text_import_more()}
    </Button>
  </div>
</div>

<style>
  .import-complete {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .import-complete-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-complete-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
