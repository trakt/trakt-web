<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
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
    popupActions,
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

{#snippet defaultPopupActions()}
  <RenderFor audience="authenticated">
    <WatchlistAction
      style="dropdown-item"
      title={media.title}
      type={media.type}
      {media}
    />
    <MarkAsWatchedAction
      style="dropdown-item"
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
    {style}
    action={action ?? defaultAction}
    popupActions={popupActions ?? defaultPopupActions}
  />
{/if}

{#if style === "summary"}
  <MediaSummaryCard
    {type}
    {media}
    {tags}
    popupActions={popupActions ?? defaultPopupActions}
    action={action ?? defaultAction}
  />
{/if}
