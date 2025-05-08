<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DisplayableProfileProps } from "../profile/DisplayableProfileProps";
  import ProfileImage from "./ProfileImage.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const isMe = $derived(slug === "me");
  const nameLabel = $derived(
    isMe
      ? m.profile_banner_greeting({ name: profile.name.first })
      : profile.name.first,
  );
</script>

<div class="profile-page-banner-container">
  <div class="profile-image-container" class:user-is-vip={profile.isVip}>
    <ProfileImage
      isEditable={isMe}
      --width="var(--ni-64)"
      --height="var(--ni-64)"
      --border-width="var(--border-thickness-s)"
      name={profile.name.first}
      src={profile.avatar.url}
    />
    {#if profile.isVip}
      <VipBadge isDirector={profile.isDirector} />
    {/if}
  </div>
  <div class="profile-info">
    <h5>
      {nameLabel}
    </h5>
    <h6 class="user-location">{profile.location}</h6>
  </div>
</div>

<style>
  .profile-page-banner-container {
    margin-left: var(--ni-72);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-m);
  }

  .profile-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(.trakt-vip-badge) {
      z-index: var(--layer-base);
      margin-top: var(--ni-neg-16);
    }

    &.user-is-vip {
      --color-border-avatar: var(--color-border-vip-avatar);
    }
  }

  .profile-info {
    .user-location {
      color: var(--color-text-secondary);
    }
  }
</style>
