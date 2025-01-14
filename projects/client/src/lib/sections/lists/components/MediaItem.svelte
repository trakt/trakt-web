<script lang="ts">
  import AvailableMediaItem from "./AvailableMediaItem.svelte";
  import FutureMediaItem from "./FutureMediaItem.svelte";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media, tags }: MediaItemProps = $props();
</script>

{#if media.airDate > new Date()}
  <FutureMediaItem {type} {media} {tags} />
{:else}
  <AvailableMediaItem {type} {media} {tags} />
{/if}
