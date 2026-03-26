<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    processedCount,
    errorCount,
    onreset,
  }: {
    processedCount: number;
    errorCount: number;
    onreset: () => void;
  } = $props();

  const successCount = $derived(processedCount - errorCount);
</script>

<div class="import-complete">
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
  <Button
    label={m.button_label_import_more()}
    onclick={onreset}
    color="default"
    size="small"
  >
    {m.button_text_import_more()}
  </Button>
</div>

<style lang="scss">
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
</style>
