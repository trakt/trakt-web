<script lang="ts">
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";

  const { media }: { media: MediaSummary } = $props();
  const MAX_GENRE_COUNT = 2;
</script>

<div class="trakt-search-result-item">
  <CrossOriginImage alt={media.title} src={media.poster.url.thumb} />
  <div class="trakt-search-result-item-details">
    <span class="trakt-search-media-title">
      {media.title} ({media.year})
    </span>
    <div class="meta-info">
      <InfoTag>
        {media.type}
      </InfoTag>

      {#if media.runtime}
        <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
      {/if}
    </div>

    <GenreList genres={media.genres.slice(0, MAX_GENRE_COUNT)} />
  </div>
</div>

<style>
  .trakt-search-result-item {
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

    .trakt-search-result-item-details {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: var(--ni-10);
      overflow: hidden;

      .trakt-search-media-title {
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
