<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  type SocialActivityItemProps = {
    activity: SocialActivity | HistoryEntry;
    activityAt: Date;
    badges?: Snippet;
  };

  const { activity, activityAt, badges }: SocialActivityItemProps = $props();
</script>

{#if activity.type === "episode"}
  <MediaSummaryCard
    {badges}
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
    {badges}
    date={activityAt}
    media={activity.movie}
    type="movie"
    variant="activity"
  />
{/if}
