<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { member }: { member: UserProfile } = $props();

  const displayName = $derived(toDisplayableName(member));
  const profileUrl = $derived(UrlBuilder.profile.user(member.slug!));
</script>

<div class="team-member-card">
  <div class="team-member-avatar-wrapper">
    <Link href={profileUrl}>
      <ProfileImage
        --image-size="var(--ni-80)"
        --border-width="var(--border-thickness-xs)"
        name={member.name.first}
        src={member.avatar.url}
        isVip={member.isVip}
      />
    </Link>
  </div>

  <div class="team-member-info">
    <div class="team-member-names">
      <Link href={profileUrl}>
        <span class="team-member-name">{displayName}</span>
      </Link>
    </div>

    {#if member.location}
      <span class="secondary team-member-location">{member.location}</span>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .team-member-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);

    text-align: center;
  }

  .team-member-avatar-wrapper {
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

  .team-member-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxs);

    width: 100%;
  }

  .team-member-names {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-micro);
  }

  .team-member-name {
    font-weight: 600;
    font-size: var(--font-size-title);

    :global(.trakt-link) & {
      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link:hover) & {
      color: var(--color-link-active);
    }
  }

  .team-member-location {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    &::before {
      content: "📍 ";
    }
  }
</style>
