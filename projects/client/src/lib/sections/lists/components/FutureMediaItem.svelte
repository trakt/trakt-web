<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import ShowCard from "$lib/components/media/card/ShowCard.svelte";
  import AirTag from "$lib/components/media/tags/AirTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchlistAction from "$lib/sections/actions/watchlist/WatchlistAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media, tags: externalTags }: MediaItemProps = $props();
</script>

{#snippet defaultTags(media: MediaItemProps["media"])}
  <AirTag i18n={TagIntlProvider} year={media.year} airDate={media.airDate} />
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
        <WatchlistAction style="action" title={media.title} {type} {media} />
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
  <ShowCard>
    {@render content(media.thumb.url)}
  </ShowCard>
{/if}

<style>
  .recommendation-title {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-weight: 500;
  }
</style>
