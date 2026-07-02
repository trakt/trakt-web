<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { currentUserWatchedMoviePlaysQuery } from "$lib/requests/queries/users/currentUserWatchedMoviePlaysQuery.ts";
  import { currentUserWatchedShowPlaysQuery } from "$lib/requests/queries/users/currentUserWatchedShowPlaysQuery.ts";
  import UsageLimitItem from "$lib/sections/vip/UsageLimitItem.svelte";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import {
    getPlaysSummary,
    type PlaysSummary,
  } from "./history-analysis/getPlaysSummary.ts";
  import SettingsBlock from "./SettingsBlock.svelte";

  const { limits } = useUser();

  const moviePlays = useQuery(currentUserWatchedMoviePlaysQuery({}));
  const showPlays = useQuery(currentUserWatchedShowPlaysQuery({}));

  type AnalysisCategory = {
    target: "movies" | "episodes";
    label: string;
    summary: PlaysSummary;
    isLoading: boolean;
  };

  const categories = $derived<AnalysisCategory[]>([
    {
      target: "movies",
      label: m.tag_text_movies(),
      summary: getPlaysSummary($moviePlays?.data ?? []),
      isLoading: $moviePlays?.isPending ?? true,
    },
    {
      target: "episodes",
      label: m.tag_text_episodes(),
      summary: getPlaysSummary($showPlays?.data ?? []),
      isLoading: $showPlays?.isPending ?? true,
    },
  ]);
</script>

<SettingsBlock
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
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</SettingsBlock>

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
</style>
