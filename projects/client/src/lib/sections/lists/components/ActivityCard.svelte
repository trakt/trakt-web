<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";
  import EpisodeCard from "./EpisodeCard.svelte";
  import MediaCard from "./MediaCard.svelte";

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
  <EpisodeCard
    episode={activity.episode}
    show={activity.show}
    variant="activity"
    date={activityAt}
    {badge}
    {popupActions}
  />
{/if}

{#if activity.type === "movie"}
  <MediaCard
    media={activity.movie}
    type="movie"
    variant="activity"
    date={activityAt}
    {badge}
    {popupActions}
  />
{/if}
