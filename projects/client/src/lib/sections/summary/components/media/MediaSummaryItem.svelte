<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaInput } from "$lib/models/MediaInput";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  const {
    media,
    tags,
    retrigger = true,
  }: {
    tags?: Snippet<[MediaInput["media"]]>;
    action?: Snippet;
    retrigger?: boolean;
  } & MediaInput = $props();
  const MAX_GENRE_COUNT = 2;
</script>

<Link
  href={UrlBuilder.media(media.type, media.slug)}
  {retrigger}
  color="inherit"
>
  <div class="trakt-summary-item">
    <CrossOriginImage alt={media.title} src={media.poster.url.thumb} />
    <div class="trakt-summary-item-details">
      <span class="trakt-summary-media-title">
        {media.title} ({media.year})
      </span>
      <div class="meta-info">
        <InfoTag>
          {media.type}
        </InfoTag>

        {#if tags == null}
          {#if media.runtime != null}
            <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
          {/if}
        {:else}
          {@render tags(media)}
        {/if}
      </div>

      <GenreList genres={media.genres.slice(0, MAX_GENRE_COUNT)} />
    </div>
  </div>
</Link>

<style>
  .trakt-summary-item {
    padding: var(--ni-8);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--ni-16);

    :global(img) {
      height: var(--ni-120);
      width: var(--ni-80);
      border: var(--border-thickness-xs) solid white;
      border-radius: var(--border-radius-s);
    }

    .trakt-summary-item-details {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: var(--ni-10);
      overflow: hidden;

      .trakt-summary-media-title {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      .meta-info {
        display: flex;
        gap: var(--ni-4);
      }

      :global(.trakt-summary-genre) {
        white-space: nowrap;
        scale: 0.8;
        transform-origin: left;
      }
    }
  }
</style>
