<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import FollowUserButton from "./_internal/FollowUserButton.svelte";
  import ProfileOptionsButton from "./_internal/ProfileOptionsButton.svelte";
  import ProfileImage from "./ProfileImage.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(slug));

  const shareableSlug = $derived($isMe ? $user.slug : slug);
</script>

<div class="profile-page-banner-container">
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
  <div class="profile-info" data-hj-suppress data-sentry-mask>
    <div class="profile-user-details">
      <span class="title">
        {toDisplayableName(profile)}
      </span>
      <span class="user-location">{profile.location}</span>
    </div>
    <div class="profile-actions">
      <ShareButton
        title={profile.name.first}
        urlOverride={UrlBuilder.profile.user(shareableSlug)}
        textFactory={({ title: name }) => m.text_share_profile({ name })}
        source={{ id: "profile", type: $isMe ? "own" : "other" }}
      />
      <RenderFor audience="authenticated">
        {#if !$isMe}
          <FollowUserButton {profile} {slug} />
        {/if}
        {#if $isMe}
          <ProfileOptionsButton />
        {/if}
      </RenderFor>
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

    transition: gap var(--transition-increment) ease-in-out;

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
      align-items: center;
      flex-direction: row;
      gap: var(--gap-xs);
      flex-grow: 1;

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
      flex-direction: row;
      gap: var(--gap-xs);
      justify-content: space-between;
    }
  }

  .profile-actions {
    display: flex;
    align-items: center;

    gap: var(--gap-s);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    @include for-tablet-sm-and-below {
      align-self: flex-end;

      gap: var(--gap-xs);
    }
  }
</style>
