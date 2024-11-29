<script lang="ts">
  import AddToWatchlistButton from "$lib/components/buttons/actions/AddToWatchlistButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import DurationTag from "$lib/components/poster/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";

  import type { MediaType } from "$lib/models/MediaType";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import {
    type RecommendedMedia,
    type RecommendedMediaItem,
  } from "./stores/useRecommendationList";

  type RecommendationItemProps = {
    recommendation: RecommendedMediaItem;
    type: MediaType;
  };

  const { type, recommendation }: RecommendationItemProps = $props();

  const { isAddingToWatchlist, isWatchlisted, watchlist } = useWatchlist({
    type,
    id: recommendation.id,
  });

  function buildLink(type: MediaType, item: RecommendedMedia[0]) {
    return type === "movie" ? `/movie/${item.slug}` : `/show/${item.slug}`;
  }
</script>

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
      {#if !$isWatchlisted}
        <AddToWatchlistButton
          label={`Mark ${recommendation.id} as watched`}
          disabled={$isAddingToWatchlist}
          onclick={async () => {
            await watchlist(recommendation.id);
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
