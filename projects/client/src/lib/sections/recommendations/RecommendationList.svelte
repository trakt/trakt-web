<script lang="ts">
  import AddToWatchlistButton from "$lib/components/buttons/actions/AddToWatchlistButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import DurationTag from "$lib/components/poster/tags/DurationTag.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";

  import type { MediaType } from "$lib/models/MediaType";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import {
    useRecommendationList,
    type RecommendedMedia,
  } from "./stores/useRecommendationList";

  type RecommendationListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: RecommendationListProps = $props();

  const { list } = useRecommendationList({ type });
  const { isLoading, isWatchlisted, add } = useWatchlist({ type });

  function buildLink(type: MediaType, item: RecommendedMedia[0]) {
    return type === "movie" ? `/movie/${item.slug}` : undefined;
  }
</script>

<SectionList {title} --height-section-list="var(--height-poster-list)">
  {#each $list as recommendation (recommendation.id)}
    <PosterCard>
      <Link href={buildLink(type, recommendation)}>
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
      </Link>

      <CardFooter>
        <p class="recommendation-title small ellipsis">
          {recommendation.title}
        </p>
        {#snippet actions()}
          {#if !isWatchlisted(recommendation.id)}
            <AddToWatchlistButton
              label={`Mark ${recommendation.id} as watched`}
              disabled={isLoading(recommendation.id)}
              onclick={async () => {
                await add(recommendation.id);
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
    padding: var(--ni-8);
    color: var(--blue-300);
  }
</style>
