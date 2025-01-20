<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaCover from "$lib/components/media/card/MediaCover.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";

  import ShowCard from "$lib/components/media/card/ShowCard.svelte";
  import EpisodeTag from "$lib/components/media/tags/EpisodeTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media, tags: externalTags, action }: MediaItemProps = $props();
</script>

{#snippet defaultTags(media: MediaItemProps["media"])}
  {#if "episode" in media}
    <EpisodeTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie"}
    <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
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

  <CardFooter {action}>
    <Link href={UrlBuilder.media(type, media.slug)}>
      <p class="recommendation-title small ellipsis">
        {media.title}
      </p>
    </Link>
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
