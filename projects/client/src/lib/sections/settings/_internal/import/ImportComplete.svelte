<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ShadowScroller from "$lib/sections/components/ShadowScroller.svelte";
  import { downloadFile } from "$lib/sections/settings/export/downloadFile.ts";
  import type {
    AmbiguousImportItem,
    UniversalImportItem,
  } from "$lib/sections/settings/import/ImportTypes.ts";
  import { toUnresolvedCsv } from "$lib/sections/settings/import/toUnresolvedCsv.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
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

  const hasBothSections = $derived(
    ambiguous.length > 0 && unresolved.length > 0,
  );

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const SKIP = -1;
  const picks = $state<Record<number, number>>({});
  let isImporting = $state(false);
  let activeTab = $state<"matches" | "skipped">("matches");

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

{#snippet candidateGrid()}
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
            <Tooltip content={toCandidateLabel(candidate)} variant="compact">
              <button
                class="ambiguous-candidate"
                class:is-selected={(picks[index] ?? 0) === candidateIndex}
                aria-label={m.button_label_pick_match({
                  option: toCandidateLabel(candidate),
                })}
                onclick={() => (picks[index] = candidateIndex)}
              >
                <span class="candidate-poster">
                  {#if candidate.poster}
                    <img src={candidate.poster} alt="" loading="lazy" />
                  {/if}
                  <span class="tag candidate-year">{candidate.year ?? "?"}</span>
                </span>
                <span class="ellipsis candidate-title">{candidate.title}</span>
              </button>
            </Tooltip>
          {/each}
          <button
            class="ambiguous-candidate is-skip"
            class:is-selected={picks[index] === SKIP}
            aria-label={m.import_ambiguous_skip()}
            onclick={() => (picks[index] = SKIP)}
          >
            <span class="candidate-poster">
              <span class="tag">{m.import_ambiguous_skip()}</span>
            </span>
          </button>
        </div>
      </li>
    {/each}
  </ul>
{/snippet}

{#snippet ambiguousSection()}
  <div class="import-complete-section">
    <p class="secondary">
      {m.import_complete_ambiguous({ count: ambiguous.length })}
    </p>
    {#if $isMouse}
      <ShadowScroller>{@render candidateGrid()}</ShadowScroller>
    {:else}
      {@render candidateGrid()}
    {/if}
    <div class="import-complete-actions">
      <Button
        label={m.button_label_import_selected()}
        onclick={importPicked}
        disabled={isImporting}
        color="purple"
        size="small"
      >
        {m.button_text_import_selected()}
      </Button>
    </div>
  </div>
{/snippet}

{#snippet unresolvedSection()}
  <div class="import-complete-section">
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
    <div class="import-complete-actions">
      <Button
        label={m.button_label_download_unresolved()}
        onclick={downloadUnresolved}
        color="default"
        variant="secondary"
        size="small"
      >
        {m.button_text_download_unresolved()}
      </Button>
    </div>
  </div>
{/snippet}

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
  </div>

  {#if hasBothSections}
    <TabView
      value={activeTab}
      onChange={(value) => {
        if (value === "matches" || value === "skipped") activeTab = value;
      }}
      tabs={[
        {
          value: "matches",
          label: m.import_tab_ambiguous(),
          content: ambiguousSection,
        },
        {
          value: "skipped",
          label: m.import_tab_unresolved(),
          content: unresolvedSection,
        },
      ]}
    />
  {:else if ambiguous.length > 0}
    {@render ambiguousSection()}
  {:else if unresolved.length > 0}
    {@render unresolvedSection()}
  {/if}

  {#if ambiguous.length === 0}
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
  {/if}
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

  .import-complete-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .import-complete-unresolved,
  .import-complete-ambiguous {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding-inline-start: var(--gap-m);
  }

  .import-complete-unresolved {
    max-height: var(--ni-160);
    overflow-y: auto;
  }

  .import-complete-unresolved li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--gap-xs);
  }

  .import-complete-ambiguous {
    list-style: none;
    padding-inline-start: 0;
    gap: var(--gap-m);
  }

  .import-complete-section :global(.trakt-shadow-wrapper) {
    max-height: var(--ni-480);
    max-width: 100%;
    align-self: flex-start;
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
    align-items: flex-start;
    gap: var(--gap-s);
  }

  .ambiguous-candidate {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--gap-xs);

    width: var(--ni-80);
    padding: 0;

    background: none;
    border: none;
    cursor: pointer;

    color: var(--color-foreground);
    font-family: inherit;
    text-align: start;
  }

  .candidate-poster {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    aspect-ratio: 2 / 3;
    overflow: hidden;

    background: var(--color-tablist-background);
    border: var(--border-thickness-m) solid transparent;
    border-radius: var(--border-radius-m);

    transition: border-color var(--transition-increment) ease-in-out;
  }

  .ambiguous-candidate.is-selected .candidate-poster {
    border-color: var(--purple-500);
  }

  .candidate-poster img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .candidate-year {
    position: relative;
    margin-block-end: var(--gap-xxs);
  }

  .candidate-title {
    text-transform: capitalize;
    text-align: center;
  }

  .ambiguous-candidate.is-skip .candidate-poster {
    align-items: center;
  }

  .import-complete-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
