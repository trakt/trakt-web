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
    source?: string;
  };

  const {
    activity,
    activityAt,
    badge,
    popupActions,
    source,
  }: SocialActivityItemProps = $props();
</script>

{#if activity.type === "episode"}
  <MediaSummaryCard
    {badge}
    {popupActions}
    {source}
    date={activityAt}
    episode={activity.episode}
    media={{
      ...activity.show,
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
    {source}
    date={activityAt}
    media={activity.movie}
    type="movie"
    variant="activity"
  />
{/if}
