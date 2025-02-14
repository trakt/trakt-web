<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import type { Snippet } from "svelte";
  import EpisodeSummaryCard from "../_internal/EpisodeSummaryCard.svelte";
  import MediaSummaryCard from "../components/MediaSummaryCard.svelte";

  type SocialActivityItemProps = {
    activity: SocialActivity;
    badges: Snippet;
  };

  const { activity, badges }: SocialActivityItemProps = $props();
</script>

{#if activity.type === "episode"}
  <EpisodeSummaryCard
    {badges}
    episode={activity.episode}
    show={{
      ...activity.show,
      episode: {
        count: 0,
      },
    }}
  />
{/if}

{#if activity.type === "movie"}
  <MediaSummaryCard
    media={activity.movie}
    {badges}
    type="movie"
    variant="thumb"
  />
{/if}
