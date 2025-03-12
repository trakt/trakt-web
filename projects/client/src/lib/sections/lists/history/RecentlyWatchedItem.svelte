<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import ActivityCard from "../components/ActivityCard.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";

  type RecentlyWatchedItemProps = {
    media: HistoryEntry;
    style?: "summary" | "cover";
  };

  const { media: activity, style = "cover" }: RecentlyWatchedItemProps =
    $props();
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

{#snippet badges()}
  {#if activity.type === "episode"}
    <EpisodeStatusTag i18n={EpisodeIntlProvider} type={activity.episode.type} />
  {/if}
{/snippet}

{#if style === "cover"}
  <ActivityCard activityAt={activity.watchedAt} {activity} {popupActions} />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    activityAt={activity.watchedAt}
    {activity}
    {badges}
    {popupActions}
  />
{/if}
