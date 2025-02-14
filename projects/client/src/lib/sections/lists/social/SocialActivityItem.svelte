<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import UserAvatar from "$lib/sections/summary/components/_internal/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/summary/components/_internal/UserProfileLink.svelte";
  import SocialActivityCard from "./SocialActivityCard.svelte";
  import SocialActivitySummaryCard from "./SocialActivitySummaryCard.svelte";

  type SocialActivityItemProps = {
    activity: SocialActivity;
    style?: "cover" | "summary";
  };

  const { activity, style = "cover" }: SocialActivityItemProps = $props();
</script>

{#snippet badges()}
  <div class="user-profile-badge">
    <UserProfileLink user={activity.user} />
    <UserAvatar user={activity.user} size="small" />
  </div>
{/snippet}

{#if style === "cover"}
  <SocialActivityCard {activity} {badges} />
{/if}

{#if style === "summary"}
  <SocialActivitySummaryCard {activity} {badges} />
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
