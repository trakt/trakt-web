<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import DurationTag from "$lib/components/poster/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";

  import type { MediaType } from "$lib/models/MediaType";
  import type { TrendingMovie } from "$lib/requests/queries/movies/movieTrendingQuery";
  import type { TrendingShow } from "$lib/requests/queries/shows/showTrendingQuery";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type TrendingItemProps = {
    trendingItem?: TrendingMovie | TrendingShow;
    type: MediaType;
  };

  const { type, trendingItem }: TrendingItemProps = $props();
</script>

<div class="trakt-preview-item">
  {#if trendingItem}
    <PosterCard>
      <Link href={UrlBuilder.media(type, trendingItem.slug)}>
        <PosterCover
          src={trendingItem.poster.url}
          alt={`${trendingItem.title} poster`}
        >
          {#snippet tags()}
            <DurationTag>
              {toHumanDuration(
                { minutes: trendingItem.runtime },
                languageTag(),
              )}
            </DurationTag>
          {/snippet}
        </PosterCover>
      </Link>

      <CardFooter>
        <p class="trending-title small ellipsis">
          {trendingItem.title}
        </p>
        <!-- TODO: add interaction to media preview items -->
      </CardFooter>
    </PosterCard>
  {/if}
</div>

<style>
  .trakt-preview-item {
    height: var(--height-poster-card);
    width: var(--width-poster-card);
  }

  .trending-title {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-weight: 500;
  }
</style>
