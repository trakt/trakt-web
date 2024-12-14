<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import type { TrendingMovie } from "$lib/requests/queries/movies/movieTrendingQuery";
  import type { TrendingShow } from "$lib/requests/queries/shows/showTrendingQuery";
  import RecommendedMedia from "$lib/sections/lists/components/RecommendedMedia.svelte";

  type TrendingItemProps = {
    trendingItem?: TrendingMovie | TrendingShow;
    type: MediaType;
  };

  const { type, trendingItem }: TrendingItemProps = $props();
</script>

<div class="trakt-preview-item">
  {#if trendingItem}
    <RecommendedMedia {type} recommendation={trendingItem} />
  {/if}
</div>

<style>
  .trakt-preview-item {
    height: var(--height-poster-card);
    width: var(--width-poster-card);
  }
</style>
