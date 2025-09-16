<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  type SocialActivityItemProps = {
    activity: SocialActivity | HistoryEntry;
    activityAt: Date;
    badge?: Snippet;
    popupActions?: Snippet;
  };

  const { activity, activityAt, badge, popupActions }: SocialActivityItemProps =
    $props();
</script>

{#if activity.type === "episode"}
  <MediaSummaryCard
    {badge}
    {popupActions}
    date={activityAt}
    episode={activity.episode}
    media={{
      ...activity.episode.show,
      episode: {
        count: 0,
      },
    }}
    type="episode"
    variant="activity"
  />
{/if}

{#if activity.type === "movie"}
  <MediaSummaryCard
    {popupActions}
    {badge}
    date={activityAt}
    media={activity.movie}
    type="movie"
    variant="activity"
  />
{/if}
