<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toVipVeteranRingTone } from "$lib/features/vip-veteran/toVipVeteranRingTone.ts";
  import type { VipVeteranPromotion } from "$lib/features/vip-veteran/VipVeteranPromotion.ts";
  import { useVipVeteran } from "$lib/features/vip-veteran/stores/useVipVeteran.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import LeaderboardPill from "$lib/sections/profile/leaderboard/LeaderboardPill.svelte";
  import MatchPill from "$lib/sections/profile/components/MatchPill.svelte";
  import VipStreakBadge from "$lib/sections/profile/vip-streak/VipStreakBadge.svelte";
  import ProfileAbout from "$lib/sections/profile/components/ProfileAbout.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import BlockedUserTag from "./_internal/BlockedUserTag.svelte";
  import PendingFollowTag from "./_internal/PendingFollowTag.svelte";
  import ProfileOverflowMenu from "./_internal/ProfileOverflowMenu.svelte";
  import { useFollowUserRequest } from "./_internal/useFollowUser";
  import ProfileImage from "./ProfileImage.svelte";

  type ProfilePageBannerProps = DisplayableProfileProps & {
    variant?: "private" | "public";
    promotion?: VipVeteranPromotion | null;
  };

  const {
    profile,
    slug,
    variant = "public",
    promotion,
  }: ProfilePageBannerProps = $props();

  const { user, blocked } = useUser();
  const { isMe } = $derived(useIsMe(slug));
  const { followStatus } = $derived(useFollowUserRequest(slug));

  const { veteran } = useVipVeteran(fromRune(() => slug));
  const shownVeteran = $derived(profile.isVip ? $veteran : null);
  const ringTone = $derived(toVipVeteranRingTone(shownVeteran));

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
      {ringTone}
      hasEntrance={shownVeteran != null}
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
          {#if shownVeteran}
            <VipStreakBadge
              veteran={shownVeteran}
              {promotion}
              isDirector={profile.isDirector}
            />
          {:else}
            <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
              {#if profile.isVip}
                <VipBadge isDirector={profile.isDirector} />
              {/if}
            </RenderFor>
          {/if}
        {/if}
      {/snippet}
    </ProfileImage>
    <div class="profile-user-details" data-hj-suppress data-sentry-mask>
      <span class="title ellipsis">{toDisplayableName(profile)}</span>
      {#if isPublic}
        <span class="user-location ellipsis">{profile.location}</span>
      {/if}
    </div>
    <div class="profile-pill" data-hj-suppress data-sentry-mask>
      {#if !$isMe && !isBlocked}
        <RenderFor audience="authenticated">
          <MatchPill {slug} />
        </RenderFor>
      {:else if $isMe}
        <LeaderboardPill />
      {/if}
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
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: var(--gap-s);

    :global(.trakt-profile-image) {
      grid-row: 1 / span 2;

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
      column-gap: var(--gap-xs);

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
    grid-area: 1 / 2;

    .user-location {
      color: var(--color-text-secondary);
    }
  }

  .profile-pill {
    grid-area: 2 / 2 / auto / -1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    container: avatar-pill / inline-size;
  }

  .profile-actions {
    grid-area: 1 / 3;
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
