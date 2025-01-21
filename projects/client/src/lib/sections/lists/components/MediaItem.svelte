<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import MediaSummaryItem from "$lib/sections/summary/components/media/MediaSummaryItem.svelte";
  import AvailableMediaItem from "./AvailableMediaItem.svelte";
  import FutureMediaItem from "./FutureMediaItem.svelte";
  import type { MediaItemProps } from "./MediaItemProps";

  const {
    type,
    media,
    tags,
    action,
    style = "card",
  }: MediaItemProps = $props();
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

{#if style === "card"}
  {#if media.airDate > new Date()}
    <FutureMediaItem
      {type}
      {media}
      {tags}
      action={action ?? defaultAction}
      {style}
    />
  {:else}
    <AvailableMediaItem
      {type}
      {media}
      {tags}
      action={action ?? defaultAction}
      {style}
    />
  {/if}
{/if}

{#if style === "list"}
  <Card>
    <MediaSummaryItem {media} {tags} />
    <CardFooter action={action ?? defaultAction} />
  </Card>
{/if}
