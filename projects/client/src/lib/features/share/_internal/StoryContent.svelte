<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import MainCredit from "./MainCredit.svelte";
  import RatingsList from "./RatingsList.svelte";

  type StoryContentProps = {
    media: MediaEntry;
    crew: MediaCrew;
    ratings: MediaRating;
  };

  const { media, crew, ratings }: StoryContentProps = $props();
</script>

<div class="trakt-story-content">
  <div class="trakt-story-details">
    <MainCredit type={media.type} {crew} />
    <RatingsList {ratings} />
  </div>
</div>

<style>
  .trakt-story-content {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 16px;

    flex: 1;
    height: 100%;

    color: #efefef;
  }

  .trakt-story-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    width: 100%;
    height: 340px;

    :global(.trakt-main-credit) {
      justify-content: center;
    }
  }
</style>
