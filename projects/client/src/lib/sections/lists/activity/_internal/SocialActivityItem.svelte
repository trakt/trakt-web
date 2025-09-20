<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import ActivityItem from "../../components/ActivityItem.svelte";
  import ActivitySummaryCard from "../../components/ActivitySummaryCard.svelte";
  import UserAvatar from "../../components/UserAvatar.svelte";
  import UserProfileLink from "../../components/UserProfileLink.svelte";

  const MAX_USERS = 10;

  type SocialActivityItemProps = {
    activity: SocialActivity;
    style?: "cover" | "summary";
  };

  const { activity, style = "cover" }: SocialActivityItemProps = $props();

  const hasMultipleUsers = $derived(activity.users.length > 1);
  const cappedUsers = $derived(activity.users.slice(0, MAX_USERS));
  const remainingUsersCount = $derived(
    activity.users.length - cappedUsers.length,
  );
</script>

{#snippet badge()}
  <div class="user-profile-badges">
    {#each cappedUsers as user (user.slug)}
      <div class="user-profile-badge" class:has-background={!hasMultipleUsers}>
        {#if !hasMultipleUsers}
          <UserProfileLink {user} />
        {/if}
        <UserAvatar {user} size="small" />
      </div>
    {/each}

    {#if remainingUsersCount > 0}
      <div class="user-profile-badge has-background">
        <p class="meta-info user-count-label">
          {m.badge_text_more({ count: remainingUsersCount })}
        </p>
      </div>
    {/if}
  </div>
{/snippet}

{#if style === "cover"}
  <ActivityItem
    {activity}
    activityAt={activity.activityAt}
    {badge}
    source="social-activity"
  />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    {activity}
    activityAt={activity.activityAt}
    {badge}
    source="social-activity"
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .user-profile-badges {
    width: 100%;

    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;

    gap: var(--gap-xxs);
  }

  .user-profile-badge {
    max-width: calc(100% - var(--ni-32));
    display: flex;

    &.has-background {
      gap: var(--gap-xs);
      align-items: center;

      padding: 0 var(--ni-4);
      background: var(--cm-background-50);
      border-radius: var(--border-radius-m);
      overflow: hidden;

      backdrop-filter: blur(var(--ni-8));
    }

    :global(.trakt-link) {
      max-width: calc(100% - var(--ni-32) - var(--gap-xs));
    }
  }

  .user-count-label {
    padding: var(--ni-8);
  }
</style>
