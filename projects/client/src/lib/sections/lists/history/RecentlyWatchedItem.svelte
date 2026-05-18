<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import AddReviewAction from "$lib/sections/media-actions/add-review/AddReviewAction.svelte";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import ActivityItem from "../components/ActivityItem.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { getToastContext } from "$lib/features/toast/_internal/getToastContext.ts";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem.ts";
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

  const { ratings } = useUser();
  const { lastWatched } = getToastContext();

  function toLastWatchedItem(activity: HistoryEntry): LastWatchedItem {
    if (activity.type === "movie") {
      return { type: "movie", media: activity.movie };
    }

    return { type: "show", media: activity.show };
  }

  function openRatingToast() {
    lastWatched.next(toLastWatchedItem(activity));
  }

  const userRating = $derived.by(() => {
    const data =
      activity.type === "episode"
        ? $ratings?.shows.get(activity.show.id)
        : $ratings?.movies.get(activity.movie.id);

    return data?.rating;
  });

  const activityType = $derived(isActionable ? "personal" : "social");
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    {#if activity.type === "episode"}
      <AddReviewAction
        style="dropdown-item"
        title={activity.show.title}
        entry={activity}
      />
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
      <AddReviewAction
        style="dropdown-item"
        title={activity.movie.title}
        entry={activity}
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
  {#if userRating}
    <UserRating rating={userRating} />
  {:else}
    <button
      type="button"
      class="trakt-history-rate-button"
      on:click={openRatingToast}
      aria-label="Rate this item"
    >
      <StarIcon fill="none" />
    </button>
  {/if}
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

<style>
  .trakt-history-rate-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-24);
    height: var(--ni-24);
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .trakt-history-rate-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 var(--ni-1) var(--color-focus-ring);
  }
</style>
