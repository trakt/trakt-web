<script lang="ts">
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import MediaTypeTag from "$lib/components/media/tags/MediaTypeTag.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { SearchResult } from "$lib/requests/queries/search/searchQuery";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";

  const MAX_GENRE_COUNT = 2;

  type SearchResultDetailsProps = {
    result: SearchResult;
  };

  const { result }: SearchResultDetailsProps = $props();
</script>

<div class="trakt-search-result-item-details">
  <span class="trakt-search-media-title">
    {result.title} ({result.year})
  </span>
  <div class="meta-info">
    <MediaTypeTag>{result.type}</MediaTypeTag>

    {#if result.runtime}
      <DurationTag>
        {toHumanDuration({ minutes: result.runtime }, languageTag())}
      </DurationTag>
    {/if}
  </div>

  <GenreList genres={result.genres.slice(0, MAX_GENRE_COUNT)} />
</div>

<style>
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
</style>
