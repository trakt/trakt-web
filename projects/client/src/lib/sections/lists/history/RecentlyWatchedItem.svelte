<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import ActivityItem from "../components/ActivityItem.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";

  type RecentlyWatchedItemProps = {
    media: HistoryEntry;
    isActionable?: boolean;
    style?: "summary" | "cover";
  };

  const {
    media: activity,
    style = "cover",
    isActionable = false,
  }: RecentlyWatchedItemProps = $props();
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    {#if activity.type === "episode"}
      <RemoveFromHistoryAction
        style="dropdown-item"
        title={activity.episode.title}
        entry={activity}
      />
    {:else}
      <WatchlistAction
        style="dropdown-item"
        title={activity.movie.title}
        type={activity.movie.type}
        media={activity.movie}
      />
      <RemoveFromHistoryAction
        style="dropdown-item"
        title={activity.movie.title}
        entry={activity}
      />
    {/if}
  </RenderFor>
{/snippet}

{#if style === "cover"}
  <ActivityItem
    activityAt={activity.watchedAt}
    {activity}
    popupActions={isActionable ? popupActions : undefined}
    source="watch-history"
  />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    activityAt={activity.watchedAt}
    {activity}
    popupActions={isActionable ? popupActions : undefined}
    source="watch-history"
  />
{/if}
