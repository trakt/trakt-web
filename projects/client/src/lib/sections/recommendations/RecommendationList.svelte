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

  import type { MediaType } from "$lib/models/MediaType";
  import { toHumanDuration } from "$lib/utils/date/toHumanDuration";
  import { useRecommendationList } from "./stores/useRecommendationList";
  import { useWatchlist } from "./stores/useWatchlist";

  type RecommendationListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: RecommendationListProps = $props();

  const { list } = useRecommendationList({ type });
  const { isLoading, isWatchlisted, add } = useWatchlist({ type });
</script>

<SectionList {title} --height-section-list="19rem">
  {#each $list as recommendation (recommendation.id)}
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
          {#if !isWatchlisted(recommendation.id)}
            <AddToWatchlistButton
              label={`Mark ${recommendation.id} as watched`}
              disabled={isLoading(recommendation.id)}
              onclick={async () => {
                await add([recommendation.id]);
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
