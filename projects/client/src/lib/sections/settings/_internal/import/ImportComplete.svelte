<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { downloadFile } from "$lib/sections/settings/export/downloadFile.ts";
  import type { UniversalImportItem } from "$lib/sections/settings/import/ImportTypes.ts";
  import { toUnresolvedCsv } from "$lib/sections/settings/import/toUnresolvedCsv.ts";
  import { slide } from "svelte/transition";

  type ImportCompleteProps = {
    processedCount: number;
    errorCount: number;
    unresolved: ReadonlyArray<UniversalImportItem>;
    onreset: () => void;
  };

  const { processedCount, errorCount, unresolved, onreset }: ImportCompleteProps =
    $props();

  const successCount = $derived(
    processedCount - errorCount - unresolved.length,
  );

  function downloadUnresolved() {
    const blob = new Blob([toUnresolvedCsv(unresolved)], {
      type: "text/csv",
    });
    downloadFile(blob, "trakt-import-skipped.csv");
  }
</script>

<div class="trakt-import-complete" transition:slide={{ duration: 150, axis: "y" }}>
  <div class="import-complete-summary">
    <p class="secondary">
      {m.import_complete_synced({ count: successCount })}
    </p>
    {#if errorCount > 0}
      <p class="secondary">
        {m.import_complete_errors({ count: errorCount })}
      </p>
    {/if}
    {#if unresolved.length > 0}
      <p class="secondary">
        {m.import_complete_unresolved({ count: unresolved.length })}
      </p>
      <ul class="import-complete-unresolved">
        {#each unresolved as item (item)}
          <li>
            <span class="ellipsis">{item.title}</span>
            {#if item.year != null}
              <span class="tag secondary">{item.year}</span>
            {/if}
          </li>
        {/each}
      </ul>
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
    {#if unresolved.length > 0}
      <Button
        label={m.button_label_download_unresolved()}
        onclick={downloadUnresolved}
        color="default"
        variant="secondary"
        size="small"
      >
        {m.button_text_download_unresolved()}
      </Button>
    {/if}
  </div>
</div>

<style>
  .trakt-import-complete {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .import-complete-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-complete-unresolved {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    max-height: var(--ni-160);
    overflow-y: auto;

    margin: 0;
    padding-inline-start: var(--gap-m);
  }

  .import-complete-unresolved li {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
  }

  .import-complete-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
