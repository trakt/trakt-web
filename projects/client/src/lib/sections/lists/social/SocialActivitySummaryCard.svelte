<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import MediaSummaryCard from "../components/MediaSummaryCard.svelte";

  type SocialActivityItemProps = {
    activity: SocialActivity;
    badges: Snippet;
  };

  const { activity, badges }: SocialActivityItemProps = $props();
</script>

{#if activity.type === "episode"}
  <MediaSummaryCard
    {badges}
    date={activity.activityAt}
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
    date={activity.activityAt}
    media={activity.movie}
    type="movie"
    variant="activity"
  />
{/if}
