<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating.ts";
  import FeedContent from "./_internal/FeedContent.svelte";
  import OpenGraphContent from "./_internal/OpenGraphContent.svelte";
  import Poster from "./_internal/Poster.svelte";
  import StoryContent from "./_internal/StoryContent.svelte";
  import type { ShareType } from "./models/ShareType.ts";
  import ShareCardFrame from "./ShareCardFrame.svelte";

  type ShareCardProps = {
    media: MediaEntry;
    crew: MediaCrew;
    ratings: MediaRating;
    posterUrl: string;
    variant: ShareType;
  };

  const { media, crew, ratings, posterUrl, variant }: ShareCardProps = $props();
</script>

<ShareCardFrame {variant} colors={media.colors}>
  <Poster {posterUrl} {variant} />

  {#if variant === "open-graph"}
    <OpenGraphContent {media} {crew} {ratings} />
  {/if}

  {#if variant === "feed"}
    <FeedContent {media} {crew} {ratings} />
  {/if}

  {#if variant === "story"}
    <StoryContent {media} {crew} {ratings} />
  {/if}
</ShareCardFrame>
