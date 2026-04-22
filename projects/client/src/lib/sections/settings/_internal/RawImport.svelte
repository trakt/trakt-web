<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { useImportInProgress } from "$lib/stores/useImportInProgress.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator";
  import { slide } from "svelte/transition";
  import {
    IMPORT_SOURCE_CONFIGS,
    type ImportCounts,
    type ImportSource,
    type ImportSourceConfig,
    type ImportStatus,
    type UniversalImportItem,
  } from "../import/ImportTypes.ts";
  import { getParser } from "../import/parsers/getParser.ts";
  import { syncToTrakt } from "../import/syncToTrakt.ts";
  import type { SyncState } from "../sync/models/SyncState.ts";
  import SyncProgress from "./components/SyncProgress.svelte";
  import ImportComplete from "./import/ImportComplete.svelte";
  import ImportDropzone from "./import/ImportDropzone.svelte";
  import ImportError from "./import/ImportError.svelte";
  import ImportGuide from "./import/ImportGuide.svelte";
  import ImportSummary from "./import/ImportSummary.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";

  function toImportSource(value: string | null): ImportSource {
    if (value && value in IMPORT_SOURCE_CONFIGS) return value as ImportSource;
    return "imdb";
  }

  const { importInProgress } = useImportInProgress();
  const { invalidate } = useInvalidator();
  const { record } = useAnalytics();

  type ImportUIState = SyncState<ImportStatus> & {
    selectedSource: ImportSource;
    parsedItems: ReadonlyArray<UniversalImportItem>;
    errorCount: number;
    parseError: string | null;
  };

  const state = $state<ImportUIState>({
    selectedSource: "imdb",
    status: "idle",
    parsedItems: [],
    processedCount: 0,
    errorCount: 0,
    parseError: null,
    totalCount: 0,
  });

  const counts = $derived<ImportCounts>({
    history: state.parsedItems.filter((i) => i.action === "history").length,
    watchlist: state.parsedItems.filter((i) => i.action === "watchlist").length,
    ratings: state.parsedItems.filter((i) => i.action === "ratings").length,
  });

  const sourceConfig = $derived(IMPORT_SOURCE_CONFIGS[state.selectedSource]);

  function getDropPrompt(): string {
    if (sourceConfig.accept.includes(".zip")) return m.import_drop_zip();
    if (sourceConfig.accept.includes(".json")) return m.import_drop_json();
    return m.import_drop_csv();
  }

  async function handleFiles(files: FileList) {
    const fileArray = Array.from(files).slice(0, sourceConfig.maxFiles);
    const parser = getParser(state.selectedSource);

    state.parseError = null;
    state.status = "parsing";

    try {
      state.parsedItems = await parser.parse(fileArray);
      state.totalCount = state.parsedItems.length;
      state.status = "review";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      state.parseError = errorMessage;
      state.status = "error";

      record(AnalyticsEvent.ImportFailed, {
        source: state.selectedSource,
        error: errorMessage,
      });
    }
  }

  async function startImport() {
    const startTime = Date.now();
    state.processedCount = 0;
    state.errorCount = 0;
    state.status = "syncing";

    try {
      const failed = await syncToTrakt(state.parsedItems, {
        onProgress: (count) => {
          state.processedCount = count;
        },
        onError: (message) => {
          // FIXME: properly deal with this when tackling https://github.com/trakt/trakt-web/issues/2055
          console.error(message);
        },
        onStart: () => {
          importInProgress.next(true);
        },
        onComplete: async (success) => {
          importInProgress.next(false);

          if (success) {
            await invalidate(InvalidateAction.Watchlisted("show"));
            await invalidate(InvalidateAction.Watchlisted("movie"));
            await invalidate(InvalidateAction.MarkAsWatched("show"));
            await invalidate(InvalidateAction.MarkAsWatched("movie"));
            await invalidate(InvalidateAction.Rated("show"));
            await invalidate(InvalidateAction.Rated("movie"));
          }
        },
      });

      const duration = Date.now() - startTime;
      const successCount = state.totalCount - failed;

      state.errorCount = failed;

      record(AnalyticsEvent.ImportCompleted, {
        source: state.selectedSource,
        totalItems: state.totalCount,
        historyCount: counts.history,
        watchlistCount: counts.watchlist,
        ratingsCount: counts.ratings,
        successCount,
        failedCount: failed,
        duration,
      });

      state.status = "complete";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      state.parseError = errorMessage;
      state.status = "error";

      record(AnalyticsEvent.ImportFailed, {
        source: state.selectedSource,
        error: errorMessage,
      });
    }
  }

  function reset() {
    state.status = "idle";
    state.parsedItems = [];
    state.processedCount = 0;
    state.errorCount = 0;
    state.parseError = null;
  }

  $effect(() => {
    const source = toImportSource(page.url.searchParams.get("source"));
    if (state.selectedSource !== source) {
      record(AnalyticsEvent.ImportInitiated, { source });
      state.selectedSource = source;
      reset();
    }
  });

  function onSourceChange(value: string) {
    const url = new URL(page.url);
    url.searchParams.set("source", value);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  const getTabLabel = (config: ImportSourceConfig) => {
    switch (config.id) {
      case "trakt-json":
        return m.import_source_json();
      case "trakt-csv":
        return m.import_source_csv();
      default:
        return config.name;
    }
  };
</script>

{#snippet importRow()}
  <NavigationGuard
    isActive={state.status === "syncing"}
    confirmationParams={{ type: ConfirmationType.CancelImport }}
    onreset={reset}
  >
    <div class="trakt-import-row">
      <ImportGuide config={sourceConfig} />
      <div class="import-body">
        {#if state.status === "parsing"}
          <p class="secondary" transition:slide={{ duration: 150, axis: "y" }}>
            {m.import_status_parsing()}
          </p>
        {:else if state.status === "idle" || state.status === "reading"}
          <ImportDropzone
            accept={sourceConfig.accept}
            maxFiles={sourceConfig.maxFiles}
            prompt={getDropPrompt()}
            onfiles={handleFiles}
          />
        {:else if state.status === "review"}
          <ImportSummary
            {counts}
            totalItems={state.totalCount}
            onstart={startImport}
            onreset={reset}
          />
        {:else if state.status === "syncing"}
          <SyncProgress
            processedCount={state.processedCount}
            totalCount={state.totalCount}
            label={m.import_status_syncing({
              processed: state.processedCount,
              total: state.totalCount,
            })}
          />
        {:else if state.status === "complete"}
          <ImportComplete
            processedCount={state.processedCount}
            errorCount={state.errorCount}
            onreset={reset}
          />
        {:else if state.status === "error"}
          <ImportError error={state.parseError ?? ""} onreset={reset} />
        {/if}
      </div>
    </div>
  </NavigationGuard>
{/snippet}

<SettingsBlock title={m.header_import()} description={m.description_import()}>
  <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
    <TabView
      value={state.selectedSource}
      tabs={Object.values(IMPORT_SOURCE_CONFIGS).map((config) => ({
        value: config.id,
        label: getTabLabel(config),
        content: importRow,
      }))}
      onChange={onSourceChange}
    />
  </RenderFor>
  <RenderFor audience="authenticated" device={["tablet-sm", "mobile"]}>
    <div class="trakt-import-source">
      <span>{m.text_source()}</span>
      <DropdownList
        label={m.dropdown_label_import_source()}
        style="flat"
        size="small"
        variant="secondary"
        color="default"
        preferNative
      >
        {getTabLabel(sourceConfig)}
        {#snippet items()}
          {#each Object.values(IMPORT_SOURCE_CONFIGS) as config (config.id)}
            <DropdownItem
              disabled={config.id === state.selectedSource}
              onclick={() => onSourceChange(config.id)}
            >
              {getTabLabel(config)}
            </DropdownItem>
          {/each}
        {/snippet}
      </DropdownList>
    </div>
    {@render importRow()}
  </RenderFor>
</SettingsBlock>

<style>
  .import-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    width: 100%;
  }

  .trakt-import-source {
    display: flex;
    gap: var(--gap-m);
    align-items: center;
  }

  .trakt-import-row {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
