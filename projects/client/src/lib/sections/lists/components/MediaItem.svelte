<script lang="ts">
  import WatchlistActionButton from "$lib/components/buttons/watchlist/WatchlistActionButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import type { MediaType } from "$lib/models/MediaType";
  import type { EpisodeCount } from "$lib/requests/models/EpisodeCount";
  import type { MovieSummary } from "$lib/requests/models/MovieSummary";
  import type { ShowSummary } from "$lib/requests/models/ShowSummary";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type MediaItemProps = {
    media: MovieSummary | (ShowSummary & EpisodeCount);
    type: MediaType;
  };

  const { type, media }: MediaItemProps = $props();

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = $derived(
    useWatchlist({
      type,
      id: media.id,
    }),
  );
</script>

{#snippet content(mediaCoverImageUrl: string)}
  <Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
    <MediaCover src={mediaCoverImageUrl} alt={`${media.title} poster`}>
      {#snippet tags()}
        {#if "episode" in media}
          <DurationTag>
            {m.number_of_episodes({ count: media.episode.count })}
          </DurationTag>
        {:else if type === "movie"}
          <DurationTag>
            {toHumanDuration({ minutes: media.runtime }, languageTag())}
          </DurationTag>
        {/if}
      {/snippet}
    </MediaCover>
  </Link>

  <CardFooter>
    <Link href={UrlBuilder.media(type, media.slug)}>
      <p class="recommendation-title small ellipsis">
        {media.title}
      </p>
    </Link>
    {#snippet actions()}
      <RenderFor audience="authenticated">
        <WatchlistActionButton
          title={media.title}
          onAdd={addToWatchlist}
          onRemove={removeFromWatchlist}
          isWatchlisted={$isWatchlisted}
          isWatchlistUpdating={$isWatchlistUpdating}
        />
      </RenderFor>
    {/snippet}
  </CardFooter>
{/snippet}

{#if type === "movie"}
  <PosterCard>
    {@render content(media.poster.url)}
  </PosterCard>
{/if}

{#if type === "show"}
  <EpisodeCard>
    {@render content(media.thumb.url)}
  </EpisodeCard>
{/if}

<style>
  .recommendation-title {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-weight: 500;
  }
</style>
