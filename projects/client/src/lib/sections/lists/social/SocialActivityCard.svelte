<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import UserAvatar from "$lib/sections/summary/components/_internal/UserAvatar.svelte";
  import EpisodeCard from "../components/EpisodeCard.svelte";
  import MediaCard from "../components/MediaCard.svelte";

  const { entry }: { entry: SocialActivity } = $props();
</script>

{#snippet badges()}
  <UserAvatar user={entry.user} size="small" />
{/snippet}

{#if entry.type === "episode"}
  <EpisodeCard
    episode={entry.episode}
    show={entry.show}
    variant="activity"
    date={entry.activityAt}
    {badges}
  />
{/if}

{#if entry.type === "movie"}
  <MediaCard
    media={entry.movie}
    type="movie"
    variant="activity"
    date={entry.activityAt}
    {badges}
  />
{/if}
