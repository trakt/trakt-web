<script lang="ts">
  import type { Snippet } from "svelte";
  import EpisodeItem from "./EpisodeItem.svelte";
  import MediaItem from "./MediaItem.svelte";
  import type { ActivityItemProps } from "./_internal/ActivityItemProps";

  const {
    activity,
    activityAt,
    badge,
    popupActions,
    source,
    action,
    activityType,
  }: ActivityItemProps & {
    action?: Snippet;
  } = $props();
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
    {activityType}
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
    {activityType}
  />
{/if}
