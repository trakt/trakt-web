<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { MediaCardProps } from "./MediaCardProps";
  import MediaItemCard from "./MediaItemCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: MediaCardProps = $props();
  const style = $derived(props.style ?? "cover");
</script>

{#snippet defaultAction()}
  {#if props.variant !== "activity"}
    <RenderFor audience="authenticated">
      <WatchlistAction
        style="action"
        title={props.media.title}
        type={props.media.type}
        media={props.media}
      />
    </RenderFor>
  {/if}
{/snippet}

{#snippet defaultPopupActions()}
  <RenderFor audience="authenticated">
    <WatchlistAction
      style="dropdown-item"
      title={props.media.title}
      type={props.media.type}
      media={props.media}
    />
    <MarkAsWatchedAction
      style="dropdown-item"
      title={props.media.title}
      type={props.media.type}
      media={props.media}
    />
  </RenderFor>
{/snippet}

{#if style === "cover"}
  <MediaItemCard
    {...props}
    {style}
    action={props.action ?? defaultAction}
    popupActions={props.variant === "activity"
      ? undefined
      : defaultPopupActions}
  />
{/if}

{#if style === "summary"}
  <MediaSummaryCard
    {...props}
    {style}
    action={props.action ?? defaultAction}
    popupActions={props.variant === "activity"
      ? undefined
      : defaultPopupActions}
  />
{/if}
