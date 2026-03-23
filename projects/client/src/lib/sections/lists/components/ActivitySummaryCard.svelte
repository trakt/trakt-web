<script lang="ts">
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { ActivityItemProps } from "./_internal/ActivityItemProps";

  const {
    activity,
    activityAt,
    badge,
    popupActions,
    source,
    activityType,
  }: ActivityItemProps = $props();
</script>

{#if activity.type === "episode"}
  <MediaSummaryCard
    {badge}
    {popupActions}
    {source}
    {activityType}
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
    {activityType}
    date={activityAt}
    media={activity.movie}
    type="movie"
    variant="activity"
  />
{/if}
