<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import FollowUserButton from "./_internal/FollowUserButton.svelte";
  import ProfileImage from "./ProfileImage.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(slug));

  const nameLabel = $derived(
    $isMe
      ? m.header_profile_banner_greeting({ name: profile.name.first })
      : profile.name.first,
  );
  const shareableSlug = $derived($isMe ? $user.slug : slug);
</script>

<div class="profile-page-banner-container">
  <ProfileImage
    isEditable={$isMe}
    --width="var(--ni-64)"
    --height="var(--ni-64)"
    --border-width="var(--border-thickness-s)"
    name={profile.name.first}
    src={profile.avatar.url}
    isVip={profile.isVip}
  >
    {#snippet badge()}
      {#if profile.isVip}
        <VipBadge isDirector={profile.isDirector} />
      {/if}
    {/snippet}
  </ProfileImage>
  <div class="profile-info" data-hj-suppress data-sentry-mask>
    <div class="profile-user-details">
      <h5>
        {nameLabel}
      </h5>
      <h6 class="user-location">{profile.location}</h6>
    </div>
    <div class="profile-actions">
      <RenderFor audience="authenticated">
        {#if !$isMe}
          <FollowUserButton {profile} {slug} />
        {/if}
        {#if $isMe}
          <SettingsButton />
        {/if}
      </RenderFor>
      <ShareButton
        title={profile.name.first}
        urlOverride={UrlBuilder.profile.user(shareableSlug)}
        textFactory={({ title: name }) => m.text_share_profile({ name })}
      />
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-page-banner-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-m);

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
      flex-direction: row;
      align-items: flex-end;

      margin: 0;
    }
  }

  .profile-info {
    display: flex;
    flex-direction: column;

    gap: var(--gap-m);

    .user-location {
      color: var(--color-text-secondary);
    }

    @include for-tablet-sm-and-below {
      width: 100%;
      flex-direction: column-reverse;

      gap: 0;
    }
  }

  .profile-actions {
    display: flex;
    align-items: center;

    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      align-self: flex-end;

      gap: var(--gap-xs);
    }
  }
</style>
