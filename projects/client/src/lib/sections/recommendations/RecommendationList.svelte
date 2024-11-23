<script lang="ts">
  import AddToWatchlistButton from "$lib/components/buttons/AddButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import DurationTag from "$lib/components/poster/tags/DurationTag.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import { type RecommendedMovie } from "$lib/requests/queries/recommendations/recommendedMoviesQuery";
  import type { RecommendedShow } from "$lib/requests/queries/recommendations/recommendedShowsQuery";
  import { toHumanDuration } from "$lib/utils/date/toHumanDuration";
  import { createQuery, type CreateQueryOptions } from "@tanstack/svelte-query";
  import { SvelteMap } from "svelte/reactivity";
  import { derived } from "svelte/store";

  type RecommendedMedia = Array<RecommendedMovie | RecommendedShow>;

  type RecommendationListProps = {
    title: string;
    queryOptions: () => CreateQueryOptions<RecommendedMedia>;
    onAddToWatchlist: (id: number) => Promise<unknown> | void;
  };

  const { queryOptions, title, onAddToWatchlist }: RecommendationListProps =
    $props();

  const loadingMap = new SvelteMap<number, boolean>();
  const watchlistMap = new SvelteMap<number, boolean>();

  const query = createQuery(queryOptions());
  const recommendations = derived(query, ($query) => $query.data ?? []);
</script>

<SectionList {title} --height-section-list="19rem">
  {#each $recommendations as recommendation (recommendation.id)}
    <PosterCard>
      <PosterCover
        src={recommendation.poster.url}
        alt={`${recommendation.title} poster`}
      >
        {#snippet tags()}
          {#if "episode" in recommendation}
            <DurationTag>
              {m.number_of_episodes({ count: recommendation.episode.count })}
            </DurationTag>
          {:else}
            <DurationTag>
              {toHumanDuration(
                { minutes: recommendation.runtime },
                languageTag(),
              )}
            </DurationTag>
          {/if}
        {/snippet}
      </PosterCover>

      <CardFooter>
        <p class="recommendation-title small ellipsis">
          {recommendation.title}
        </p>
        {#snippet actions()}
          {#if !watchlistMap.get(recommendation.id)}
            <AddToWatchlistButton
              label={`Mark ${recommendation.id} as watched`}
              disabled={loadingMap.get(recommendation.id) ?? false}
              onclick={async () => {
                loadingMap.set(recommendation.id, true);
                await onAddToWatchlist(recommendation.id);
                loadingMap.set(recommendation.id, false);
                watchlistMap.set(recommendation.id, true);
              }}
            />
          {:else}
            <div class="watchlist-added-icon">
              <CheckIcon />
            </div>
          {/if}
        {/snippet}
      </CardFooter>
    </PosterCard>
  {/each}
</SectionList>

<style>
  .recommendation-title {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-weight: 500;
  }

  /* FIXME: This is a temporary solution to indicate that 
   * a recommendation has been added to the watchlist
   */
  .watchlist-added-icon {
    padding: 0.375rem;
    color: var(--blue-300);
  }
</style>
