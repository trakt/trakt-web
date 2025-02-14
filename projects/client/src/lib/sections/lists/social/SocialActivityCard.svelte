<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import EpisodeCard from "../components/EpisodeCard.svelte";
  import MediaCard from "../components/MediaCard.svelte";

  type SocialActivityCardProps = {
    activity: SocialActivity;
    badges: Snippet;
  };

  const { activity, badges }: SocialActivityCardProps = $props();
</script>

{#if activity.type === "episode"}
  <EpisodeCard
    episode={activity.episode}
    show={activity.show}
    variant="activity"
    date={activity.activityAt}
    {badges}
  />
{/if}

{#if activity.type === "movie"}
  <MediaCard
    media={activity.movie}
    type="movie"
    variant="activity"
    date={activity.activityAt}
    {badges}
  />
{/if}
