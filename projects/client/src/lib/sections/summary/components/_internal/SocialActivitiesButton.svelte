<script lang="ts">
  import AvatarPill from "$lib/components/avatar-pill/AvatarPill.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../_internal/summaryDrawerNavigation.ts";
  import { useSocialActivities } from "./useSocialActivities.ts";

  const avatarDisplayLimit = 5;

  type SocialActivitiesButtonProps = {
    target: MediaSocialQueryTarget;
    title: string;
    // When provided, open a locally-mounted drawer instead of navigating to
    // the `view=social` URL drawer (used by the episode drawer, which can't
    // route without replacing itself).
    onclick?: () => void;
  };

  const { target, title, onclick }: SocialActivitiesButtonProps = $props();

  const target$ = fromRune(() => target);
  const {
    entries: socialEntries,
    isLoading,
    hasNextPage,
  } = useSocialActivities(target$);

  const activityCount = $derived($socialEntries.length);
  const isInitialLoading = $derived($isLoading && activityCount === 0);

  const avatars = $derived(
    $socialEntries
      .slice(0, avatarDisplayLimit)
      .map((entry) => ({ key: entry.key, user: entry.user })),
  );

  const countLabel = $derived(
    activityCount > 0 ? `${activityCount}${$hasNextPage ? "+" : ""}` : null,
  );

  const label = $derived(
    activityCount === 0
      ? m.text_no_activity()
      : activityCount === 1
      ? m.text_social_activity()
      : m.text_social_activities(),
  );

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.Social));
</script>

<div class="trakt-social-activities-button-link-wrapper">
  {#if isInitialLoading}
    <div class="social-activities-skeleton" role="status" aria-busy="true">
      <span class="skeleton-count"></span>
      <span class="skeleton-label"></span>
    </div>
  {:else if onclick}
    <AvatarPill
      {avatars}
      {countLabel}
      {label}
      {onclick}
      ariaLabel={m.link_label_view_social_activities({ title })}
    />
  {:else}
    <AvatarPill
      {avatars}
      {countLabel}
      {label}
      href={drawerLink.href}
      noscroll={drawerLink.noscroll}
      replacestate={drawerLink.replacestate}
      ariaLabel={m.link_label_view_social_activities({ title })}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-social-activities-button-link-wrapper {
    align-self: flex-start;
    margin-top: var(--gap-xxs);

    @include for-tablet-sm-and-below {
      align-self: center;
    }
  }

  .social-activities-skeleton {
    --height-watched-by-label: calc(var(--font-size-text) + var(--ni-2));

    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--ni-36);
    padding: 0 var(--ni-8);
    box-sizing: border-box;
    border-radius: var(--border-radius-xxl);

    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);

    cursor: default;
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    .skeleton-count {
      width: 3.5ch;
    }

    .skeleton-label {
      width: 8.5ch;
    }

    span {
      display: inline-block;
      height: var(--height-watched-by-label);
      border-radius: var(--border-radius-xs, var(--ni-4));
      background: color-mix(in srgb, var(--color-foreground) 12%, transparent);

      position: relative;
      overflow: hidden;

      &::after {
        content: "";

        position: absolute;
        top: 0;

        width: 300%;
        height: 100%;

        transform: translateX(100%);

        animation: slide calc(8 * var(--transition-increment)) infinite;

        background: linear-gradient(
          110deg,
          transparent 0%,
          transparent 30%,
          color-mix(in srgb, var(--color-foreground) 25%, transparent) 50%,
          transparent 70%,
          transparent 100%
        );
      }
    }
  }
</style>
