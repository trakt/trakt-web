<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import {
    InvalidateAction,
    type InvalidateActionOptions,
  } from "$lib/requests/models/InvalidateAction.ts";
  import { currentUserWatchedMoviePlaysQuery } from "$lib/requests/queries/users/currentUserWatchedMoviePlaysQuery.ts";
  import { currentUserWatchedShowPlaysQuery } from "$lib/requests/queries/users/currentUserWatchedShowPlaysQuery.ts";
  import UsageLimitItem from "$lib/sections/vip/UsageLimitItem.svelte";
  import { useClearInProgress } from "$lib/stores/useClearInProgress.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { slide } from "svelte/transition";
  import { cleanUpHistoryPlays } from "../sync/cleanUpHistoryPlays.ts";
  import type { SyncState } from "../sync/models/SyncState.ts";
  import SyncProgress from "./components/SyncProgress.svelte";
  import {
    getPlaysSummary,
    type PlaysSummary,
  } from "./history-analysis/getPlaysSummary.ts";
  import SettingsSection from "./SettingsSection.svelte";

  const { limits } = useUser();
  const { invalidateAll } = useInvalidator();
  const { clearInProgress } = useClearInProgress();
  const { confirm } = useConfirm();

  const moviePlays = useQuery(currentUserWatchedMoviePlaysQuery({}));
  const showPlays = useQuery(currentUserWatchedShowPlaysQuery({}));

  type CleanUpTarget = "movies" | "episodes";
  type CleanUpStatus = "idle" | "cleaning" | "done";

  type AnalysisCategory = {
    target: CleanUpTarget;
    label: string;
    buttonLabel: string;
    summary: PlaysSummary;
    isLoading: boolean;
    invalidations: InvalidateActionOptions[];
  };

  const categories = $derived<AnalysisCategory[]>([
    {
      target: "movies",
      label: m.tag_text_movies(),
      buttonLabel: m.button_label_clean_up_movies(),
      summary: getPlaysSummary($moviePlays?.data ?? []),
      isLoading: $moviePlays?.isPending ?? true,
      invalidations: [InvalidateAction.MarkAsWatched("movie")],
    },
    {
      target: "episodes",
      label: m.tag_text_episodes(),
      buttonLabel: m.button_label_clean_up_episodes(),
      summary: getPlaysSummary($showPlays?.data ?? []),
      isLoading: $showPlays?.isPending ?? true,
      invalidations: [
        InvalidateAction.MarkAsWatched("show"),
        InvalidateAction.MarkAsWatched("episode"),
      ],
    },
  ]);

  const syncState = $state<SyncState<CleanUpStatus>>({
    status: "idle",
    processedCount: 0,
    totalCount: 0,
  });
  let activeTarget = $state<CleanUpTarget | null>(null);
  let doneTarget = $state<CleanUpTarget | null>(null);
  let removedCount = $state(0);

  const isCleaning = $derived(syncState.status === "cleaning");

  let abortController: AbortController | null = null;
  async function startCleanUp(category: AnalysisCategory) {
    const { duplicateIds } = category.summary;
    if (duplicateIds.length === 0) return;

    abortController = new AbortController();
    clearInProgress.next(true);
    activeTarget = category.target;
    doneTarget = null;
    syncState.status = "cleaning";
    syncState.processedCount = 0;
    syncState.totalCount = duplicateIds.length;

    await cleanUpHistoryPlays(duplicateIds, {
      signal: abortController.signal,
      onProgress: (n) => {
        syncState.processedCount = n;
      },
      onError: (message) => {
        console.error(message);
      },
      onComplete: async (success, failedCount = 0) => {
        if (!success) {
          stopCleanUp();
          return;
        }

        removedCount = syncState.totalCount - failedCount;
        await invalidateAll(category.invalidations);
        clearInProgress.next(false);
        doneTarget = category.target;
        activeTarget = null;
        syncState.status = "done";
      },
    });
  }

  function stopCleanUp() {
    abortController?.abort();
    clearInProgress.next(false);
    activeTarget = null;
    syncState.status = "idle";
    syncState.processedCount = 0;
    syncState.totalCount = 0;
  }
</script>

{#snippet loadingIcon()}
  <LoadingIndicator />
{/snippet}

<NavigationGuard
  isActive={isCleaning}
  confirmationParams={{ type: ConfirmationType.CancelClear }}
  onreset={stopCleanUp}
>
  <SettingsSection
    title={m.header_history_analysis()}
    description={m.description_history_analysis()}
  >
    <div class="trakt-history-analysis">
      {#if $limits}
        <UsageLimitItem
          item={{
            title: m.limit_title_watch_history,
            limits: $limits.history,
          }}
          variant="free"
        />
      {/if}

      <div class="analysis-grid">
        {#each categories as category (category.target)}
          <div
            class="analysis-card"
            class:has-duplicates={category.summary.duplicates > 0}
          >
            <span class="secondary bold tag">{category.label}</span>

            {#if category.isLoading}
              <div class="card-loading">
                <LoadingIndicator />
              </div>
            {:else}
              <div class="duplicate-hero">
                <span class="duplicate-count bold">
                  {toHumanNumber(category.summary.duplicates, languageTag())}
                </span>
                <span class="secondary duplicate-label">
                  {m.text_duplicate_plays()}
                </span>
              </div>

              <div class="card-divider"></div>

              <div class="card-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-value bold">
                    {toHumanNumber(category.summary.unique, languageTag())}
                  </span>
                  <span class="secondary breakdown-label">
                    {m.text_unique_items()}
                  </span>
                </div>
                <div class="breakdown-separator"></div>
                <div class="breakdown-item">
                  <span class="breakdown-value bold">
                    {toHumanNumber(category.summary.total, languageTag())}
                  </span>
                  <span class="secondary breakdown-label">
                    {m.text_total_plays()}
                  </span>
                </div>
                <div class="breakdown-actions">
                  <Button
                    label={category.buttonLabel}
                    size="small"
                    color="red"
                    variant="secondary"
                    disabled={$clearInProgress ||
                      category.summary.duplicates === 0}
                    icon={isCleaning && activeTarget === category.target
                      ? loadingIcon
                      : undefined}
                    onclick={confirm({
                      type: ConfirmationType.CleanUpHistory,
                      count: category.summary.duplicates,
                      onConfirm: () => startCleanUp(category),
                    })}
                  >
                    {m.button_text_clean_up()}
                  </Button>
                </div>
              </div>

              {#if isCleaning && activeTarget === category.target}
                <div transition:slide={{ duration: 150, axis: "y" }}>
                  <SyncProgress
                    processedCount={syncState.processedCount}
                    totalCount={syncState.totalCount}
                    label={m.cleanup_status_removing({
                      processed: syncState.processedCount,
                      total: syncState.totalCount,
                    })}
                  />
                </div>
              {/if}

              {#if syncState.status === "done" && doneTarget === category.target}
                <p
                  class="secondary italic cleanup-done"
                  transition:slide={{ duration: 150, axis: "y" }}
                >
                  {m.cleanup_status_done({ count: removedCount })}
                </p>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </SettingsSection>
</NavigationGuard>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-history-analysis {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }

  .analysis-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-20) var(--ni-24);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    border: var(--border-thickness-xxs) solid transparent;
    transition: border-color var(--transition-increment) ease;

    &.has-duplicates {
      border-color: color-mix(
        in srgb,
        var(--color-sentiment-bad) 25%,
        transparent
      );

      .duplicate-count {
        color: var(--color-sentiment-bad);
      }
    }
  }

  .card-loading {
    display: flex;
    justify-content: center;
    padding: var(--gap-l) 0;
  }

  .duplicate-hero {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .duplicate-count {
    font-size: var(--ni-40);
  }

  .card-divider {
    height: var(--ni-1);
    background-color: color-mix(in srgb, var(--color-border) 60%, transparent);
    margin: var(--gap-xs) 0;
  }

  .card-breakdown {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .breakdown-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .breakdown-value {
    font-size: var(--font-size-title);
    line-height: 1;
  }

  .breakdown-separator {
    width: var(--ni-1);
    height: var(--ni-24);
    background-color: color-mix(in srgb, var(--color-border) 60%, transparent);
  }

  .breakdown-actions {
    margin-inline-start: auto;
  }

  .cleanup-done {
    margin: 0;
  }
</style>
