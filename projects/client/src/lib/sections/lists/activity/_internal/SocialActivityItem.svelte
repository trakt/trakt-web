<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import ActivityItem from "../../components/ActivityItem.svelte";
  import ActivitySummaryCard from "../../components/ActivitySummaryCard.svelte";
  import UserAvatar from "../../components/UserAvatar.svelte";
  import UserProfileLink from "../../components/UserProfileLink.svelte";

  const maxUsers = 10;

  type SocialActivityItemProps = {
    activity: SocialActivity;
    style?: "cover" | "summary";
  };

  const { activity, style = "cover" }: SocialActivityItemProps = $props();

  const hasMultipleUsers = $derived(activity.users.length > 1);
  const cappedUsers = $derived(activity.users.slice(0, maxUsers));
  const remainingUsersCount = $derived(
    activity.users.length - cappedUsers.length,
  );
</script>

{#snippet activityRating()}
  {#if activity.rating}
    <UserRating rating={activity.rating} />
  {/if}
{/snippet}

{#snippet profileBadges()}
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
        <p class="bold user-count-label">
          {m.badge_text_more({ count: remainingUsersCount })}
        </p>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet summaryBadge()}
  <div class="trakt-summary-badge">
    {@render activityRating()}
    {@render profileBadges()}
  </div>
{/snippet}

{#if style === "cover"}
  <ActivityItem
    {activity}
    activityAt={activity.activityAt}
    badge={profileBadges}
    source="social-activity"
    action={activityRating}
  />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    {activity}
    activityAt={activity.activityAt}
    badge={summaryBadge}
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

      padding-left: var(--ni-12);
      background: color-mix(
        in srgb,
        var(--color-card-background) 50%,
        transparent
      );
      border-radius: var(--border-radius-l);
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

  .trakt-summary-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--gap-s);

    width: 100%;

    @include for-tablet-sm-and-below() {
      flex-direction: row-reverse;
      align-items: center;
    }
  }
</style>
