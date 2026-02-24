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
    source?: string;
    action?: Snippet;
  };

  const {
    activity,
    activityAt,
    badge,
    popupActions,
    source,
    action,
  }: SocialActivityCardProps = $props();
</script>

{#if activity.type === "episode"}
  <EpisodeItem
    episode={activity.episode}
    media={activity.show}
    variant="activity"
    date={activityAt}
    {badge}
    {popupActions}
    {source}
    {action}
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
    {source}
    {action}
  />
{/if}
