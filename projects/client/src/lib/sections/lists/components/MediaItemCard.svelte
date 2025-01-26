<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";

  import CardCover from "$lib/components/card/CardCover.svelte";
  import ThumbCard from "$lib/components/media/card/ThumbCard.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MediaCardProps } from "./MediaCardProps";

  const {
    type,
    media,
    tags: externalTags,
    action,
    variant = "poster",
  }: MediaCardProps = $props();
</script>

{#snippet defaultTags(media: MediaCardProps["media"])}
  {#if media.airDate > new Date()}
    <AirDateTag
      i18n={TagIntlProvider}
      year={media.year}
      airDate={media.airDate}
    />
  {:else if "episode" in media}
    <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie"}
    <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
  {/if}
{/snippet}

{#snippet content(mediaCoverImageUrl: string)}
  <Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
    <CardCover src={mediaCoverImageUrl} alt={`${media.title} poster`}>
      {#snippet tags()}
        {#if externalTags}
          {@render externalTags(media)}
        {:else}
          {@render defaultTags(media)}
        {/if}
      {/snippet}
    </CardCover>
  </Link>

  <CardFooter {action}>
    <Link href={UrlBuilder.media(type, media.slug)}>
      <p class="recommendation-title small ellipsis">
        {media.title}
      </p>
    </Link>
  </CardFooter>
{/snippet}

{#if variant === "poster"}
  <PosterCard>
    {@render content(media.poster.url.thumb)}
  </PosterCard>
{/if}

{#if variant === "thumb"}
  <ThumbCard>
    {@render content(media.thumb.url)}
  </ThumbCard>
{/if}

<style>
  .recommendation-title {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-weight: 500;
  }
</style>
