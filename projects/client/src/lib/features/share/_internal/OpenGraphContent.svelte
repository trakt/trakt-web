<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import { SHARE_TYPE_DIMENSIONS } from "../models/ShareType.ts";
  import MainCredit from "./MainCredit.svelte";
  import RatingsList from "./RatingsList.svelte";
  import Title from "./Title.svelte";

  type OpenGraphContentProps = {
    media: MediaEntry;
    crew: MediaCrew;
    ratings: MediaRating;
  };

  const { media, crew, ratings }: OpenGraphContentProps = $props();

  const { padding } = $derived(SHARE_TYPE_DIMENSIONS["open-graph"]);
</script>

<div
  class="trakt-open-graph-content"
  style="padding-right: {padding}px; padding-left: {padding * 2}px;"
>
  <Title title={media.title} />
  <MainCredit type={media.type} {crew} />
  <RatingsList {ratings} />
</div>

<style>
  .trakt-open-graph-content {
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
