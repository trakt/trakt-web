<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
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
  };

  const { target, title }: SocialActivitiesButtonProps = $props();

  const target$ = fromRune(() => target);
  const {
    entries: socialEntries,
    isLoading,
    hasNextPage,
  } = useSocialActivities(target$);

  const activityCount = $derived($socialEntries.length);
  const isInitialLoading = $derived($isLoading && activityCount === 0);

  const watchers = $derived($socialEntries.slice(0, avatarDisplayLimit));
  const activityCountLabel = $derived(
    `${activityCount}${$hasNextPage ? "+" : ""}`,
  );

  const hasWatchers = $derived(watchers.length > 0);
  const avatarStackCount = $derived(watchers.length);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.Social));
</script>

<RenderForFeature flag={FeatureFlag.SocialActivities}>
  {#snippet enabled()}
    <div class="trakt-social-activities-button-link-wrapper">
      {#if isInitialLoading}
        <div class="social-activities-skeleton" role="status" aria-busy="true">
          <span class="skeleton-count"></span>
          <span class="skeleton-label"></span>
        </div>
      {:else}
        <Link
          {...drawerLink}
          color="inherit"
          label={m.link_label_view_social_activities({ title })}
        >
          <span class="social-activities-content">
            {#if hasWatchers}
              <span
                class="trakt-social-activities-avatar-stack"
                aria-hidden="true"
              >
                {#each watchers as watcher, index (watcher.key)}
                  <span
                    class="trakt-social-activities-avatar"
                    style:z-index={avatarStackCount - index}
                  >
                    <UserAvatar user={watcher.user} size="small" />
                  </span>
                {/each}
              </span>
            {/if}

            <span
              class="trakt-social-activities-label"
              class:is-text-only={activityCount === 0}
            >
              {#if activityCount > 0}
                <span class="trakt-social-activities-count bold">
                  {activityCountLabel}
                </span>
                <span class="trakt-social-activities-text">
                  {activityCount === 1
                    ? m.text_social_activity()
                    : m.text_social_activities()}
                </span>
              {:else}
                <span class="trakt-social-activities-text">
                  {m.text_no_activity()}
                </span>
              {/if}
            </span>
          </span>
        </Link>
      {/if}
    </div>
  {/snippet}
</RenderForFeature>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-social-activities-button-link-wrapper {
    align-self: flex-start;
    margin-top: var(--gap-xxs);

    :global(.trakt-link) {
      text-decoration: none;
    }

    @include for-tablet-sm-and-below {
      align-self: center;
    }
  }

  .social-activities-skeleton,
  .social-activities-content {
    --pill-accent: var(--color-foreground);
    --height-watched-by-label: calc(var(--font-size-text) + var(--ni-2));

    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--ni-36);
    padding: 0 var(--ni-8);
    box-sizing: border-box;
    border-radius: var(--border-radius-xxl);

    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--pill-accent) 22%, transparent) 0%,
      color-mix(in srgb, var(--pill-accent) 22%, transparent) 0%,
      color-mix(in srgb, var(--color-foreground) 5%, transparent) 0%,
      color-mix(in srgb, var(--color-foreground) 5%, transparent) 100%
    );

    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);
    color: inherit;

    cursor: pointer;

    font-family: inherit;
    white-space: nowrap;

    transition:
      transform var(--transition-increment) ease-out,
      border-color var(--transition-increment) ease-out;

    &:active {
      transform: scale(0.97);
    }
  }

  .trakt-social-activities-avatar-stack {
    display: inline-flex;
    align-items: center;
    pointer-events: none;
  }

  .trakt-social-activities-avatar {
    --watched-by-avatar-size: var(--ni-28);

    position: relative;

    width: var(--watched-by-avatar-size);
    height: var(--watched-by-avatar-size);
    flex: 0 0 var(--watched-by-avatar-size);

    margin-inline-start: calc(var(--watched-by-avatar-size) * -0.5);

    border-radius: 50%;
    overflow: hidden;
    box-sizing: border-box;

    &:first-child {
      margin-inline-start: 0;
    }

    :global(.trakt-user-avatar) {
      width: var(--watched-by-avatar-size);
      height: var(--watched-by-avatar-size);

      :global(img) {
        border-width: var(--ni-1);
      }
    }
  }

  .trakt-social-activities-label {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--height-watched-by-label);
    padding-inline-end: var(--ni-4);

    &.is-text-only {
      padding-inline: var(--ni-8);
    }
  }

  .trakt-social-activities-text {
    opacity: 0.85;
  }

  .trakt-social-activities-count {
    font-variant-numeric: tabular-nums;
  }

  .social-activities-skeleton {
    cursor: default;
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    &:active {
      transform: none;
    }

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
