<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { MediaCardProps } from "./MediaCardProps";
  import MediaItemCard from "./MediaItemCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const {
    type,
    media,
    tags,
    action,
    style = "cover",
  }: MediaCardProps = $props();
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

{#if style === "cover"}
  <MediaItemCard
    {type}
    {media}
    {tags}
    action={action ?? defaultAction}
    {style}
  />
{/if}

{#if style === "summary"}
  <MediaSummaryCard {type} {media} {tags} action={action ?? defaultAction} />
{/if}
