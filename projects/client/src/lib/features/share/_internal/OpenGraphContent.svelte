<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import MainCredit from "./MainCredit.svelte";
  import RatingsList from "./RatingsList.svelte";
  import Title from "./Title.svelte";

  type OpenGraphContentProps = {
    media: MediaEntry;
    crew: MediaCrew;
    ratings: MediaRating;
  };

  const { media, crew, ratings }: OpenGraphContentProps = $props();
</script>

<div class="trakt-open-graph-content">
  <Title title={media.title} />
  <MainCredit type={media.type} {crew} />
  <RatingsList {ratings} />
</div>

<style>
  .trakt-open-graph-content {
    padding: 48px;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;

    flex: 1;
    height: 100%;

    color: #efefef;
  }
</style>
