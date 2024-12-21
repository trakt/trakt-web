<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import type { ActiveWatcher } from "$lib/models/ActiveWatcher";
  import type { MediaRating } from "$lib/models/MediaRating";
  import MediaMetaTags from "./MediaMetaTags.svelte";
  import type { MediaSummary } from "./MediaSummary";

  type MediaMetaInfoProps = {
    media: MediaSummary;
    ratings: MediaRating;
    watchers: ActiveWatcher[];
  };

  const { media, ratings, watchers }: MediaMetaInfoProps = $props();
</script>

<div class="trakt-media-meta">
  <RatingList {ratings} />
  <MediaMetaTags {media} {watchers} />
</div>

<style>
  .trakt-media-meta {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
