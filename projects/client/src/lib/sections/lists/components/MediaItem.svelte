<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import type { EpisodeCount } from "$lib/requests/models/EpisodeCount";
  import type { MovieSummary } from "$lib/requests/models/MovieSummary";
  import type { ShowSummary } from "$lib/requests/models/ShowSummary";
  import AvailableMediaItem from "./AvailableMediaItem.svelte";
  import FutureMediaItem from "./FutureMediaItem.svelte";

  type MediaItemProps = {
    media: MovieSummary | (ShowSummary & EpisodeCount);
    type: MediaType;
  };

  const { type, media }: MediaItemProps = $props();
</script>

{#if media.airedDate > new Date()}
  <FutureMediaItem {type} {media} />
{:else}
  <AvailableMediaItem {type} {media} />
{/if}
