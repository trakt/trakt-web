<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import { getLocale } from "$lib/features/i18n";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { toHumanETA } from "$lib/utils/formatting/date/toHumanETA";
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
</script>

{#snippet defaultTags(media: MediaItemProps["media"])}
  <DurationTag>
    {#if media.year == null}
      {m.tba_label()}
    {:else}
      {toHumanETA(new Date(), media.airedDate, getLocale())}
    {/if}
  </DurationTag>
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
