<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media, tags: externalTags }: MediaItemProps = $props();

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = $derived(
    useWatchlist({
      type,
      media,
    }),
  );

  const { isMarkingAsWatched, isWatched, markAsWatched, removeWatched } =
    $derived(
      useMarkAsWatched({
        type: type as "movie" | "show",
        media,
      }),
    );
</script>

{#snippet defaultTags(media: MediaItemProps["media"])}
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

{#snippet content(mediaCoverImageUrl: string)}
  <Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
    <MediaCover src={mediaCoverImageUrl} alt={`${media.title} poster`}>
      {#snippet tags()}
        {#if externalTags}
          {@render externalTags(media)}
        {:else}
          {@render defaultTags(media)}
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
        <WatchlistButton
          type="action"
          title={media.title}
          onAdd={addToWatchlist}
          onRemove={removeFromWatchlist}
          isWatchlisted={$isWatchlisted}
          isWatchlistUpdating={$isWatchlistUpdating}
        />
        <MarkAsWatchedButton
          type="action"
          title={media.title}
          isWatched={$isWatched}
          isMarkingAsWatched={$isMarkingAsWatched}
          onWatch={markAsWatched}
          onRemove={removeWatched}
        />
      </RenderFor>
    {/snippet}
  </CardFooter>
{/snippet}

{#if type === "movie"}
  <PosterCard>
    {@render content(media.poster.url.thumb)}
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
