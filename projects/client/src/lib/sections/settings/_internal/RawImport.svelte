<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";
  import {
    IMPORT_SOURCE_CONFIGS,
    type ImportCounts,
    type ImportSource,
    type ImportStatus,
    type UniversalImportItem,
  } from "../import/ImportTypes.ts";
  import { getParser } from "../import/parsers/getParser.ts";
  import { syncToTrakt } from "../import/syncToTrakt.ts";
  import ImportComplete from "./import/ImportComplete.svelte";
  import ImportDropzone from "./import/ImportDropzone.svelte";
  import ImportProgress from "./import/ImportProgress.svelte";
  import ImportSummary from "./import/ImportSummary.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const { user, limits } = useUser();

  let selectedSource = $state<ImportSource>("imdb");
  let status = $state<ImportStatus>("idle");
  let parsedItems = $state<UniversalImportItem[]>([]);
  let processedCount = $state(0);
  let errorCount = $state(0);
  let parseError = $state<string | null>(null);

  const counts = $derived<ImportCounts>({
    history: parsedItems.filter((i) => i.action === "history").length,
    watchlist: parsedItems.filter((i) => i.action === "watchlist").length,
    ratings: parsedItems.filter((i) => i.action === "ratings").length,
  });

  const isVipLimitExceeded = $derived.by(() => {
    if ($user?.isVip) return false;
    if (!$limits) return false;

    const watchlistFreeLimit = $limits.watchlistItems.free;
    const historyFreeLimit = $limits.history.free;

    return (
      counts.watchlist > watchlistFreeLimit || counts.history > historyFreeLimit
    );
  });

  const sourceConfig = $derived(IMPORT_SOURCE_CONFIGS[selectedSource]);

  function getDropPrompt(): string {
    if (sourceConfig.accept === ".zip") return m.import_drop_zip();
    if (sourceConfig.accept === ".json") return m.import_drop_json();
    return m.import_drop_csv();
  }

  async function handleFiles(files: FileList) {
    parseError = null;
    status = "reading";

    const fileArray = Array.from(files);
    const parser = getParser(selectedSource);

    status = "parsing";

    try {
      parsedItems = await parser.parse(fileArray);
      status = "review";
    } catch (err) {
      parseError = err instanceof Error ? err.message : String(err);
      status = "error";
    }
  }

  async function startImport() {
    processedCount = 0;
    errorCount = 0;
    status = "syncing";

    try {
      const failed = await syncToTrakt(parsedItems, {
        onProgress: (count) => {
          processedCount = count;
        },
        onError: () => {
          errorCount += 1;
        },
      });

      errorCount = failed;
      status = "complete";
    } catch (err) {
      parseError = err instanceof Error ? err.message : String(err);
      status = "error";
    }
  }

  function reset() {
    status = "idle";
    parsedItems = [];
    processedCount = 0;
    errorCount = 0;
    parseError = null;
  }
</script>

<SettingsBlock title={m.header_import()} description={m.description_import()}>
  <SettingsRow title={m.header_import()}>
    <div class="trakt-raw-import">
      <div class="import-source-tabs" role="tablist">
        {#each Object.values(IMPORT_SOURCE_CONFIGS) as config (config.id)}
          <button
            role="tab"
            aria-selected={selectedSource === config.id}
            class="import-source-tab"
            class:active={selectedSource === config.id}
            onclick={() => {
              selectedSource = config.id;
              reset();
            }}
          >
            {#if config.id === "imdb"}
              {m.import_source_imdb()}
            {:else if config.id === "letterboxd"}
              {m.import_source_letterboxd()}
            {:else if config.id === "tvtime"}
              {m.import_source_tvtime()}
            {:else if config.id === "trakt-json"}
              {m.import_source_json()}
            {:else}
              {m.import_source_csv()}
            {/if}
          </button>
        {/each}
      </div>

      <div class="import-body">
        {#if status === "idle" || status === "reading" || status === "parsing"}
          <div
            class="import-idle"
            transition:slide={{ duration: 150, axis: "y" }}
          >
            {#if status === "parsing"}
              <p
                class="secondary"
                transition:slide={{ duration: 150, axis: "y" }}
              >
                {m.import_status_parsing()}
              </p>
            {:else}
              <ImportDropzone
                accept={sourceConfig.accept}
                maxFiles={sourceConfig.maxFiles}
                prompt={getDropPrompt()}
                onfiles={handleFiles}
              />
            {/if}
          </div>
        {:else if status === "review"}
          <div transition:slide={{ duration: 150, axis: "y" }}>
            <ImportSummary
              {counts}
              totalItems={parsedItems.length}
              {isVipLimitExceeded}
              onstart={startImport}
              onreset={reset}
            />
          </div>
        {:else if status === "syncing"}
          <div transition:slide={{ duration: 150, axis: "y" }}>
            <ImportProgress {processedCount} totalCount={parsedItems.length} />
          </div>
        {:else if status === "complete"}
          <div transition:slide={{ duration: 150, axis: "y" }}>
            <ImportComplete {processedCount} {errorCount} onreset={reset} />
          </div>
        {:else if status === "error"}
          <div
            class="import-error"
            transition:slide={{ duration: 150, axis: "y" }}
          >
            <p class="secondary">
              {m.import_status_error({ message: parseError ?? "" })}
            </p>
            <button class="import-retry-link secondary" onclick={reset}>
              {m.button_text_cancel()}
            </button>
          </div>
        {/if}
      </div>
    </div>
  </SettingsRow>
</SettingsBlock>

<style lang="scss">
  .trakt-raw-import {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    width: 100%;
  }

  .import-source-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }

  .import-source-tab {
    padding: var(--ni-8) var(--ni-16);
    border-radius: var(--border-radius-s);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
    background: transparent;
    color: var(--color-foreground-secondary);
    cursor: pointer;
    font-size: var(--font-size-s);
    transition:
      border-color var(--transition-increment) ease-in-out,
      color var(--transition-increment) ease-in-out,
      background-color var(--transition-increment) ease-in-out;

    &:hover {
      border-color: var(--color-border);
      color: var(--color-foreground);
    }

    &.active {
      border-color: var(--color-background-purple);
      color: var(--color-background-purple);
      background-color: color-mix(
        in srgb,
        var(--color-background-purple) 8%,
        transparent
      );
    }
  }

  .import-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .import-error {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-retry-link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: underline;
    font-size: inherit;
    text-align: left;
  }
</style>
