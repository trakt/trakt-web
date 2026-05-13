<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useClearInProgress } from "$lib/stores/useClearInProgress.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator";
  import { slide } from "svelte/transition";
  import type { SyncState } from "../sync/models/SyncState";
  import { clearData } from "./clear/clearData";
  import { CLEAR_DATA_SOURCES } from "./clear/constants";
  import { getClearProperties } from "./clear/getClearProperties";
  import type { ClearDataInput } from "./clear/models/ClearDataInput";
  import type { ClearSource } from "./clear/models/ClearSource";
  import type { ClearSourceType } from "./clear/models/ClearSourceType";
  import SyncProgress from "./components/SyncProgress.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const { watchlist, ratings, history } = useUser();
  const { invalidateAll } = useInvalidator();
  const { clearInProgress } = useClearInProgress();
  const { confirm } = useConfirm();
  const { record } = useAnalytics();

  type ClearStatus = "idle" | "clearing" | "done";

  let activeSourceType = $state<ClearSourceType>("watchlist");

  const activeSource = $derived.by((): ClearSource => {
    switch (activeSourceType) {
      case "watchlist":
        return { type: activeSourceType, input: $watchlist };
      case "ratings":
        return { type: activeSourceType, input: $ratings };
      case "history":
        return { type: activeSourceType, input: $history ?? undefined };
    }
  });

  const syncState = $state<SyncState<ClearStatus>>({
    status: "idle",
    processedCount: 0,
    totalCount: 0,
  });

  const isClearing = $derived(syncState.status === "clearing");

  const { totalCount, invalidations } = $derived(
    getClearProperties(activeSource),
  );

  function isClearDataInput(source: ClearSource): source is ClearDataInput {
    return Boolean(source.input);
  }

  let abortController: AbortController | null = null;
  async function startClear() {
    const source = activeSource;
    if (!isClearDataInput(source)) return;

    record(AnalyticsEvent.ClearInitiated, { source: source.type });

    abortController = new AbortController();
    clearInProgress.next(true);
    syncState.status = "clearing";
    syncState.processedCount = 0;
    syncState.totalCount = totalCount;
    const startTime = Date.now();
    let errorCount = 0;

    await clearData(source, {
      signal: abortController.signal,
      onProgress: (n) => {
        syncState.processedCount = n;
      },
      onError: (message) => {
        console.error(message);
        errorCount++;
      },
      onComplete: async (success) => {
        if (!success) {
          clearInProgress.next(false);
          record(AnalyticsEvent.ClearFailed, {
            source: source.type,
            error: "aborted or fully failed",
          });
          return;
        }

        const duration = Date.now() - startTime;
        const successCount = syncState.totalCount - errorCount;

        record(AnalyticsEvent.ClearCompleted, {
          source: source.type,
          totalItems: syncState.totalCount,
          successCount,
          failedCount: errorCount,
          duration,
        });

        await invalidateAll(invalidations);
        clearInProgress.next(false);
        syncState.status = "done";
      },
    });
  }

  function stopClear() {
    abortController?.abort();
    clearInProgress.next(false);
    syncState.status = "idle";
    syncState.processedCount = 0;
    syncState.totalCount = 0;
  }

  const applySourceChange = (type: ClearSourceType) => {
    activeSourceType = type;
  };

  const onSourceChange = (type: ClearSourceType) => {
    if (!isClearing) {
      applySourceChange(type);
      return;
    }

    confirm({
      type: ConfirmationType.CancelClear,
      onConfirm: () => {
        stopClear();
        applySourceChange(type);
      },
    })();
  };

  const isLoading = $derived(!activeSource.input);
  const currentSourceText = $derived(
    CLEAR_DATA_SOURCES.find(
      (source) => source.type === activeSource.type,
    )?.label() ?? activeSource.type,
  );
</script>

<NavigationGuard
  isActive={isClearing}
  confirmationParams={{ type: ConfirmationType.CancelClear }}
  onreset={stopClear}
>
  <SettingsBlock
    title={m.header_clear_data()}
    description={m.description_clear_data()}
  >
    <div class="trakt-clear-data">
      <SettingsRow title={m.text_source()}>
        <div class="trakt-clear-source">
          <DropdownList
            label={m.dropdown_label_clear_source()}
            style="flat"
            size="small"
            variant="secondary"
            color="default"
            preferNative
          >
            {currentSourceText}
            {#snippet items()}
              {#each CLEAR_DATA_SOURCES as source (source.type)}
                <DropdownItem
                  disabled={source.type === activeSource.type}
                  onclick={() => onSourceChange(source.type)}
                >
                  {source.label()}
                </DropdownItem>
              {/each}
            {/snippet}
          </DropdownList>

          {#snippet loadingIcon()}
            <LoadingIndicator />
          {/snippet}
          <div class="trakt-clear-data-row">
            <Button
              label={m.button_label_clear_now({ source: currentSourceText })}
              color="red"
              size="small"
              onclick={confirm({
                type: ConfirmationType.ClearData,
                sourceText: currentSourceText,
                onConfirm: startClear,
              })}
              disabled={isLoading || isClearing || totalCount === 0}
              icon={isLoading ? loadingIcon : undefined}
            >
              {m.button_text_clear_now()}
            </Button>

            {#if syncState.status === "done"}
              <p
                class="secondary italic"
                transition:slide={{ duration: 150, axis: "y" }}
              >
                {m.clear_status_source_cleared({ source: currentSourceText })}
              </p>
            {/if}
          </div>
        </div>
      </SettingsRow>
      {#if isClearing}
        <div transition:slide={{ duration: 150, axis: "y" }}>
          <SyncProgress
            processedCount={syncState.processedCount}
            totalCount={syncState.totalCount}
            label={m.clear_status_clearing({
              processed: syncState.processedCount,
              total: syncState.totalCount,
            })}
          />
        </div>
      {/if}
    </div>
  </SettingsBlock>
</NavigationGuard>

<style>
  .trakt-clear-data {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-clear-data-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
  .trakt-clear-source {
    display: flex;
    gap: var(--gap-m);
    align-items: center;
  }
</style>
