<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ProfileAbout from "$lib/sections/profile/components/ProfileAbout.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import BlockedUserTag from "./_internal/BlockedUserTag.svelte";
  import FollowUserButton from "./_internal/FollowUserButton.svelte";
  import ProfileOverflowMenu from "./_internal/ProfileOverflowMenu.svelte";
  import ProfileImage from "./ProfileImage.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { user, blocked } = useUser();
  const { isMe } = $derived(useIsMe(slug));

  const shareableSlug = $derived($isMe ? $user.slug : slug);
  const isBlocked = $derived($blocked.has(slug));
</script>

<div class="profile-page-banner-container">
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
        <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
          {#if profile.isVip}
            <VipBadge isDirector={profile.isDirector} />
          {/if}
        </RenderFor>
      {/snippet}
    </ProfileImage>
    <div class="profile-user-details" data-hj-suppress data-sentry-mask>
      <span class="title ellipsis">{toDisplayableName(profile)}</span>
      <span class="user-location ellipsis">{profile.location}</span>
    </div>
    <div class="profile-actions">
      <RenderFor audience="authenticated">
        {#if !$isMe}
          {#if isBlocked}
            <BlockedUserTag />
          {:else}
            <FollowUserButton {profile} {slug} />
          {/if}
        {/if}
      </RenderFor>
      <div class="profile-icon-actions">
        <ShareButton
          title={profile.name.first}
          urlOverride={UrlBuilder.profile.user(shareableSlug)}
          textFactory={({ title: name }) => m.text_share_profile({ name })}
          source={{ id: "profile", type: $isMe ? "own" : "other" }}
        />
        <RenderFor audience="authenticated">
          {#if !$isMe}
            <ProfileOverflowMenu {profile} {slug} />
          {/if}
          {#if $isMe}
            <SettingsButton style="action" />
          {/if}
        </RenderFor>
      </div>
    </div>
  </div>

  <ProfileAbout {profile} {slug} />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-page-banner-container {
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

      :global(.trakt-profile-about .line-clamp-container) {
        align-items: flex-start;
      }
    }
  }

  .profile-identity {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-s);

    :global(.profile-image-container) {
      display: flex;
      flex-direction: column;
      align-items: center;

      :global(.trakt-vip-badge) {
        z-index: var(--layer-base);
        margin-top: var(--ni-neg-16);
      }
    }

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
      flex-wrap: wrap;

      span.ellipsis {
        white-space: normal;
      }

      :global(.profile-image-container) {
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

  .profile-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex-shrink: 0;

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
      width: var(--ni-32);
      height: var(--ni-32);
      padding: var(--ni-10) 0 0;

      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
        color: inherit;
      }

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-28);
      }
    }
  }
</style>
