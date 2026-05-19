<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import MainCredit from "./MainCredit.svelte";
  import RatingsList from "./RatingsList.svelte";

  type FeedContentProps = {
    media: MediaEntry;
    crew: MediaCrew;
    ratings: MediaRating;
  };

  const { media, crew, ratings }: FeedContentProps = $props();
</script>

<div class="trakt-feed-content">
  <div class="trakt-feed-details">
    <MainCredit type={media.type} {crew} />
    <RatingsList {ratings} />
  </div>
</div>

<style>
  .trakt-feed-content {
    position: relative;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;

    flex: 1;
    height: 100%;

    color: #efefef;
  }

  .trakt-feed-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    width: 100%;

    :global(.trakt-main-credit) {
      justify-content: center;
    }
  }
</style>
