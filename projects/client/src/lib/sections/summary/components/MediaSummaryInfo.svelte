<script lang="ts">
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import type { MediaSummary } from "./MediaSummary";
  import type { MediaSummaryProps } from "./MediaSummaryProps";

  const { media, ratings }: MediaSummaryProps<MediaSummary> = $props();
</script>

<div class="trakt-summary-header">
  <h3>{media.title}</h3>
  <GenreList genres={media.genres} />
</div>

<RatingList {ratings} />

<p class="trakt-media-overview secondary">{media.overview}</p>

<style>
  .trakt-summary-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .trakt-media-overview {
    line-height: 150%;
  }
</style>
