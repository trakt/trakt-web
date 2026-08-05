<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import AchievementsAnchorHost from "$lib/features/vip-achievements/AchievementsAnchorHost.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import LeaderboardPill from "$lib/sections/profile/leaderboard/LeaderboardPill.svelte";
  import MatchPill from "$lib/sections/profile/components/MatchPill.svelte";
  import ProfileAbout from "$lib/sections/profile/components/ProfileAbout.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import BlockedUserTag from "./_internal/BlockedUserTag.svelte";
  import PendingFollowTag from "./_internal/PendingFollowTag.svelte";
  import ProfileOverflowMenu from "./_internal/ProfileOverflowMenu.svelte";
  import { useFollowUserRequest } from "./_internal/useFollowUser";
  import ProfileImage from "./ProfileImage.svelte";

  type ProfilePageBannerProps = DisplayableProfileProps & {
    variant?: "private" | "public";
  };

  const {
    profile,
    slug,
    variant = "public",
  }: ProfilePageBannerProps = $props();

  const { user, blocked } = useUser();
  const { isMe } = $derived(useIsMe(slug));
  const { followStatus } = $derived(useFollowUserRequest(slug));

  const { isEnabled } = useFeatureFlag();
  const leaderboardEnabled = isEnabled(FeatureFlag.Leaderboard);
  const vipAchievementsEnabled = isEnabled(FeatureFlag.VipAchievements);

  const shareableSlug = $derived($isMe ? $user.slug : slug);
  const isBlocked = $derived($blocked.has(slug));
  const isPending = $derived($followStatus === "pending");

  const isPublic = $derived(variant === "public");
</script>

<div class="trakt-profile-page-banner">
  <div class="profile-identity">
    <ProfileImage
      isEditable={$isMe}
      --image-size="var(--ni-64)"
      --border-width="var(--border-thickness-s)"
      name={profile.name.first}
      src={profile.avatar.url}
      isVip={profile.isVip}
    >
      {#snippet badge()}
        <RenderFor audience="authenticated">
          {#if !$isMe && isBlocked}
            <BlockedUserTag />
          {:else if !$isMe && isPending}
            <PendingFollowTag />
          {/if}
        </RenderFor>
        {#if !isBlocked && !isPending}
          <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
            {#if profile.isVip}
              <VipBadge isDirector={profile.isDirector} />
            {/if}
          </RenderFor>
        {/if}
      {/snippet}
    </ProfileImage>
    <div class="profile-user-details" data-hj-suppress data-sentry-mask>
      <span class="title ellipsis">{toDisplayableName(profile)}</span>
      {#if isPublic}
        <span class="user-location ellipsis">{profile.location}</span>
      {/if}
      <div class="profile-identity-pills">
        <div class="identity-pill-slot">
          {#if !$isMe && !isBlocked}
            <RenderFor audience="authenticated">
              <MatchPill {slug} />
            </RenderFor>
          {:else if $isMe && $leaderboardEnabled}
            <LeaderboardPill />
          {/if}
        </div>
        {#if $isMe && profile.isDirector && $vipAchievementsEnabled}
          <AchievementsAnchorHost {profile} />
        {/if}
      </div>
    </div>
    <div class="profile-actions">
      <div class="profile-icon-actions">
        {#if isPublic}
          <ShareButton
            title={profile.name.first}
            urlOverride={UrlBuilder.profile.user(shareableSlug)}
            textFactory={({ title: name }) => m.text_share_profile({ name })}
            source={{ id: "profile", type: $isMe ? "own" : "other" }}
          />
        {/if}
        <RenderFor audience="authenticated">
          {#if !$isMe}
            <ProfileOverflowMenu {profile} {slug} />
          {:else}
            <SettingsButton style="action" />
          {/if}
        </RenderFor>
      </div>
    </div>
  </div>

  {#if isPublic}
    <ProfileAbout {profile} {slug} />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-page-banner {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    width: 100%;
    height: 100%;
    min-height: 0;

    :global(.trakt-profile-about) {
      flex: 1;
      min-height: 0;
    }

    @include for-tablet-sm-and-below {
      height: auto;

      :global(.trakt-profile-about) {
        flex: initial;
      }

      :global(.trakt-profile-about .trakt-clamped-text) {
        align-items: flex-start;
      }
    }
  }

  .profile-identity {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-s);

    // Query container for the leaderboard pill. Its width is driven by layout
    // (not the pill's content), so the pill can size to the space available
    // without a feedback loop. The pill may use the whole row except the
    // profile image and its gap, so reserve that inline space.
    container: avatar-pill / inline-size;
    --avatar-pill-reserved-inline: calc(var(--ni-64) + var(--gap-s));

    :global(.trakt-profile-image) {
      display: flex;
      flex-direction: column;
      align-items: center;

      :global(.trakt-vip-badge),
      :global(.trakt-blocked-user-tag),
      :global(.trakt-pending-follow-tag) {
        z-index: var(--layer-base);
        margin-top: var(--ni-neg-16);
      }
    }

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
      flex-wrap: wrap;

      --avatar-pill-reserved-inline: calc(var(--ni-40) + var(--gap-xs));

      span.ellipsis {
        white-space: normal;
      }

      :global(.trakt-profile-image) {
        --width: var(--ni-40);
        --height: var(--ni-40);
        --border-width: var(--border-thickness-xs);
      }
    }
  }

  .profile-user-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
    min-width: 0;
    flex: 1;

    .user-location {
      color: var(--color-text-secondary);
    }
  }

  // Pantheon / match pill and the achievements anchor share one row beneath
  // the handle, never stacking: the pill absorbs any shrinking (it ellipsises
  // its label and tightens its avatar overlap) while the anchor keeps its
  // content width.
  // Pantheon / match pill and the achievements anchor always sit side by side,
  // both at their natural width so neither label is cut short. The row is
  // allowed to run past this (content-width) details column into the space
  // beneath the pinned action buttons - the same overflow the pill already
  // relied on when it had the row to itself.
  .profile-identity-pills {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-xs);
    flex-wrap: nowrap;

    :global(.trakt-achievements-anchor) {
      flex: 0 0 auto;
    }
  }

  // Below the width where both fit on one line, drop the anchor underneath
  // rather than let the row spill past the edge of the banner card.
  @container avatar-pill (max-width: 380px) {
    .profile-identity-pills {
      flex-wrap: wrap;
    }
  }

  // Own box for the Pantheon / match pill, sitting beside the achievements
  // anchor. Deliberately NOT an `avatar-pill` container: `container-type:
  // inline-size` makes a box ignore its own content when sizing, which
  // collapses a content-width flex item to nothing.
  // Own box for the Pantheon / match pill, sitting beside the achievements
  // anchor. Sized by its content and never shrunk: constraining the pill from
  // out here only ever collapsed it to its avatars, because it measures itself
  // against the banner row via a container query and every box in between is
  // shrink-to-fit. Letting it keep its width and wrapping the row instead
  // keeps the label readable at every viewport size.
  .identity-pill-slot {
    display: flex;
    flex: 0 0 auto;

    &:empty {
      display: none;
    }

    :global(.trakt-leaderboard-pill),
    :global(.trakt-match-pill) {
      margin-top: 0;
    }
  }

  .profile-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex-shrink: 0;

    // Pin to the top so the icons clear the taller details column (name +
    // location + leaderboard/match pill) instead of overlapping it.
    align-self: flex-start;

    position: relative;
    z-index: var(--layer-raised);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
    }
  }

  .profile-icon-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(.trakt-popup-menu-button) {
      @include for-mouse() {
        &:hover {
          background-color: color-mix(
            in srgb,
            var(--color-foreground) 10%,
            transparent
          );
          color: inherit;
        }
      }
    }
  }
</style>
