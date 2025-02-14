<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import UserAvatar from "$lib/sections/summary/components/_internal/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/summary/components/_internal/UserProfileLink.svelte";
  import EpisodeCard from "../components/EpisodeCard.svelte";
  import MediaCard from "../components/MediaCard.svelte";

  const { entry }: { entry: SocialActivity } = $props();
</script>

{#snippet badges()}
  <div class="user-profile-badge">
    <UserProfileLink user={entry.user} />
    <UserAvatar user={entry.user} size="small" />
  </div>
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

<style>
  .user-profile-badge {
    max-width: calc(100% - var(--ni-32));
    display: flex;
    gap: var(--gap-xs);
    align-items: center;

    padding: 0 var(--ni-4);
    backdrop-filter: blur(var(--ni-8)) contrast(0.6);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(.trakt-link) {
      max-width: 75%;
    }
  }
</style>
