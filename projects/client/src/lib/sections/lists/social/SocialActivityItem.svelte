<script lang="ts">
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import ActivityCard from "../components/ActivityCard.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import UserAvatar from "../components/UserAvatar.svelte";
  import UserProfileLink from "../components/UserProfileLink.svelte";

  type SocialActivityItemProps = {
    activity: SocialActivity;
    style?: "cover" | "summary";
  };

  const { activity, style = "cover" }: SocialActivityItemProps = $props();
</script>

{#snippet badge()}
  <div class="user-profile-badge">
    <UserProfileLink user={activity.user} />
    <UserAvatar user={activity.user} size="small" />
  </div>
{/snippet}

{#if style === "cover"}
  <ActivityCard {activity} activityAt={activity.activityAt} {badge} />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard {activity} activityAt={activity.activityAt} {badge} />
{/if}

<style>
  .user-profile-badge {
    max-width: calc(100% - var(--ni-32));
    display: flex;
    gap: var(--gap-xs);
    align-items: center;

    padding: 0 var(--ni-4);
    backdrop-filter: blur(var(--ni-8));
    background: color-mix(in srgb, var(--color-background) 50%, transparent);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(.trakt-link) {
      max-width: 75%;
    }
  }
</style>
