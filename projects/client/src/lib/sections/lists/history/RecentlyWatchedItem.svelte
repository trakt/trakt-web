<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RateAction from "$lib/sections/media-actions/rating/RateAction.svelte";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { RateNowProps } from "$lib/sections/summary/components/rating/models/RateNowProps";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import ActivityItem from "../components/ActivityItem.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import type { HistoryEntry } from "../stores/models/HistoryEntry";

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

  const rateTarget = $derived<RateNowProps>(
    activity.type === "episode"
      ? {
          type: "episode",
          media: activity.episode,
          show: activity.show,
        }
      : {
          type: "movie",
          media: activity.movie,
        },
  );

  const activityType = $derived(isActionable ? "personal" : "social");

  const targetTitle = $derived.by(() => {
    if (activity.type === "episode") {
      return episodeActivityTitle(activity.episode);
    }

    return activity.movie.title;
  });
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

{#snippet action()}
  <RenderFor audience="authenticated">
    <RateAction target={rateTarget} title={targetTitle} {style} />
  </RenderFor>
{/snippet}

{#if style === "cover"}
  <ActivityItem
    activityAt={activity.watchedAt}
    {activity}
    popupActions={isActionable ? popupActions : undefined}
    action={isActionable ? action : undefined}
    source="watch-history"
    {activityType}
  />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    activityAt={activity.watchedAt}
    {activity}
    popupActions={isActionable ? popupActions : undefined}
    badge={isActionable ? action : undefined}
    source="watch-history"
    {activityType}
  />
{/if}
