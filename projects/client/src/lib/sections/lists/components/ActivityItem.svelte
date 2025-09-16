<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";
  import EpisodeItem from "./EpisodeItem.svelte";
  import MediaItem from "./MediaItem.svelte";

  type SocialActivityCardProps = {
    activity: SocialActivity | HistoryEntry;
    activityAt: Date;
    badge?: Snippet;
    popupActions?: Snippet;
  };

  const { activity, activityAt, badge, popupActions }: SocialActivityCardProps =
    $props();
</script>

{#if activity.type === "episode"}
  <EpisodeItem
    episode={activity.episode}
    show={activity.episode.show}
    variant="activity"
    date={activityAt}
    {badge}
    {popupActions}
  />
{/if}

{#if activity.type === "movie"}
  <MediaItem
    media={activity.movie}
    type="movie"
    variant="activity"
    date={activityAt}
    {badge}
    {popupActions}
  />
{/if}
