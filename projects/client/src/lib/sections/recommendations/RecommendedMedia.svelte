<script lang="ts">
  import WatchlistActionButton from "$lib/components/buttons/watchlist/WatchlistActionButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import DurationTag from "$lib/components/poster/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";

  import type { MediaType } from "$lib/models/MediaType";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { buildMediaLink } from "$lib/utils/url/buildMediaLink";
  import { type RecommendedMediaItem } from "./stores/useRecommendationList";

  type RecommendationItemProps = {
    recommendation: RecommendedMediaItem;
    type: MediaType;
  };

  const { type, recommendation }: RecommendationItemProps = $props();

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = useWatchlist({
    type,
    id: recommendation.id,
  });
</script>

<PosterCard>
  <Link href={buildMediaLink(type, recommendation.slug)}>
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
      <WatchlistActionButton
        title={recommendation.title}
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
        isWatchlisted={$isWatchlisted}
        isWatchlistUpdating={$isWatchlistUpdating}
      />
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
</style>
