<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import EpisodeCard from "../components/EpisodeCard.svelte";
  import MediaCard from "../components/MediaCard.svelte";

  const { entry }: { entry: SocialActivity } = $props();
</script>

{#if entry.type === "episode"}
  <EpisodeCard
    episode={entry.episode}
    show={entry.show}
    variant="activity"
    date={entry.activityAt}
  />
{/if}

{#if entry.type === "movie"}
  <MediaCard
    media={entry.movie}
    type="movie"
    variant="activity"
    date={entry.activityAt}
  />
{/if}
