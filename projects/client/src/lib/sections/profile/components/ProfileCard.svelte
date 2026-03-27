<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { profile }: { profile: UserProfile } = $props();

  const displayName = $derived(toDisplayableName(profile));
  const profileUrl = $derived(UrlBuilder.profile.user(profile.slug!));
</script>

<div class="trakt-profile-card">
  <div class="trakt-profile-avatar-wrapper">
    <Link href={profileUrl}>
      <ProfileImage
        --image-size="var(--ni-80)"
        --border-width="var(--border-thickness-xs)"
        name={profile.name.first}
        src={profile.avatar.url}
        isVip={profile.isVip}
      />
    </Link>
  </div>

  <div class="trakt-profile-info">
    <div class="trakt-profile-names">
      <Link href={profileUrl}>
        <span class="trakt-profile-name">{displayName}</span>
      </Link>
    </div>

    {#if profile.location}
      <span class="secondary trakt-profile-location">{profile.location}</span>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);

    text-align: center;
  }

  .trakt-profile-avatar-wrapper {
    :global(.trakt-link) {
      display: block;
      border-radius: 50%;
      transition: opacity var(--transition-increment) ease-in-out;

      @include for-mouse {
        &:hover {
          opacity: 0.85;
        }
      }
    }
  }

  .trakt-profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxs);

    width: 100%;
  }

  .trakt-profile-names {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-micro);
  }

  .trakt-profile-name {
    font-weight: 600;
    font-size: var(--font-size-title);

    :global(.trakt-link) & {
      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link:hover) & {
      color: var(--color-link-active);
    }
  }

  .trakt-profile-location {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    &::before {
      content: "📍 ";
    }
  }
</style>
