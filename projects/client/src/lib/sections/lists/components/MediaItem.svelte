<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import AvailableMediaItem from "./AvailableMediaItem.svelte";
  import FutureMediaItem from "./FutureMediaItem.svelte";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media, tags, action }: MediaItemProps = $props();
</script>

{#snippet defaultAction()}
  <RenderFor audience="authenticated">
    <WatchlistAction
      style="action"
      title={media.title}
      type={media.type}
      {media}
    />
  </RenderFor>
{/snippet}

{#if media.airDate > new Date()}
  <FutureMediaItem {type} {media} {tags} action={action ?? defaultAction} />
{:else}
  <AvailableMediaItem {type} {media} {tags} action={action ?? defaultAction} />
{/if}
