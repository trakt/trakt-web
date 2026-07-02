<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { downloadFile } from "$lib/sections/settings/export/downloadFile.ts";
  import type {
    AmbiguousImportItem,
    UniversalImportItem,
  } from "$lib/sections/settings/import/ImportTypes.ts";
  import { toUnresolvedCsv } from "$lib/sections/settings/import/toUnresolvedCsv.ts";
  import { slide } from "svelte/transition";

  type ImportCompleteProps = {
    processedCount: number;
    errorCount: number;
    unresolved: ReadonlyArray<UniversalImportItem>;
    ambiguous: ReadonlyArray<AmbiguousImportItem>;
    onimportpicked: (
      picked: UniversalImportItem[],
      skipped: UniversalImportItem[],
    ) => Promise<void>;
    onreset: () => void;
  };

  const {
    processedCount,
    errorCount,
    unresolved,
    ambiguous,
    onimportpicked,
    onreset,
  }: ImportCompleteProps = $props();

  const successCount = $derived(
    processedCount - errorCount - unresolved.length - ambiguous.length,
  );

  const SKIP = -1;
  const picks = $state<Record<number, number>>({});
  let isImporting = $state(false);

  function pickedCandidate(index: number) {
    const pick = picks[index] ?? 0;
    if (pick === SKIP) return undefined;
    return ambiguous.at(index)?.candidates.at(pick);
  }

  function toCandidateLabel(candidate: { title: string; year?: number }) {
    return candidate.year != null
      ? `${candidate.title} (${candidate.year})`
      : candidate.title;
  }

  async function importPicked() {
    const picked: UniversalImportItem[] = [];
    const skipped: UniversalImportItem[] = [];

    ambiguous.forEach((entry, index) => {
      const candidate = pickedCandidate(index);
      if (candidate) picked.push({ ...entry.item, ids: candidate.ids });
      else skipped.push(entry.item);
    });

    isImporting = true;
    try {
      await onimportpicked(picked, skipped);
    } finally {
      isImporting = false;
    }
  }

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
            <span class="ellipsis item-title">{item.title}</span>
            {#if item.year != null}
              <span class="tag secondary">{item.year}</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    {#if ambiguous.length > 0}
      <p class="secondary">
        {m.import_complete_ambiguous({ count: ambiguous.length })}
      </p>
      <ul class="import-complete-ambiguous">
        {#each ambiguous as entry, index (entry)}
          <li>
            <div class="ambiguous-title">
              <span class="ellipsis item-title">{entry.item.title}</span>
              {#if entry.item.year != null}
                <span class="tag secondary">{entry.item.year}</span>
              {/if}
            </div>
            <div class="ambiguous-candidates">
              {#each entry.candidates as candidate, candidateIndex (candidate)}
                <button
                  class="ambiguous-candidate"
                  class:is-selected={(picks[index] ?? 0) === candidateIndex}
                  aria-label={m.button_label_pick_match({
                    option: toCandidateLabel(candidate),
                  })}
                  title={toCandidateLabel(candidate)}
                  onclick={() => (picks[index] = candidateIndex)}
                >
                  {#if candidate.poster}
                    <img
                      class="candidate-poster"
                      src={candidate.poster}
                      alt=""
                      loading="lazy"
                    />
                  {/if}
                  <span class="tag">{candidate.year ?? "?"}</span>
                </button>
              {/each}
              <button
                class="ambiguous-candidate"
                class:is-selected={picks[index] === SKIP}
                onclick={() => (picks[index] = SKIP)}
              >
                <span class="tag">{m.import_ambiguous_skip()}</span>
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="import-complete-actions">
    {#if ambiguous.length > 0}
      <Button
        label={m.button_label_import_selected()}
        onclick={importPicked}
        disabled={isImporting}
        color="purple"
        size="small"
      >
        {m.button_text_import_selected()}
      </Button>
    {/if}
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

  .import-complete-unresolved,
  .import-complete-ambiguous {
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
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--gap-xs);
  }

  .import-complete-ambiguous {
    max-height: var(--ni-480);
    list-style: none;
    padding-inline-start: 0;
  }

  .import-complete-ambiguous li {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .ambiguous-title {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
  }

  /* Parsed titles are de-slugged lowercase; capitalize for display only. */
  .item-title {
    text-transform: capitalize;
  }

  .ambiguous-candidates {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: var(--gap-s);
  }

  .ambiguous-candidate {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-xs);

    padding: var(--gap-xs);

    background: none;
    border: var(--border-thickness-xs) solid transparent;
    border-radius: var(--border-radius-m);
    cursor: pointer;

    /* Buttons default to UA colors, not the theme foreground. */
    color: var(--color-foreground);
    font-family: inherit;
  }

  .ambiguous-candidate.is-selected {
    border-color: var(--purple-500);
    background: color-mix(in srgb, var(--purple-500) 12%, transparent);
  }

  .candidate-poster {
    width: var(--ni-64);
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: var(--border-radius-s);
  }

  .import-complete-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
