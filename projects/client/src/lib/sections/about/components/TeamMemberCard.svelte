<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { member }: { member: UserProfile } = $props();

  const displayName = $derived(toDisplayableName(member));
  const profileUrl = $derived(
    member.slug ? UrlBuilder.profile.user(member.slug) : undefined,
  );
</script>

<div class="team-member-card">
  <div class="team-member-avatar-wrapper">
    {#if profileUrl}
      <Link href={profileUrl}>
        <ProfileImage
          --image-size="var(--ni-80)"
          --border-width="var(--border-thickness-xs)"
          name={member.name.first}
          src={member.avatar.url}
          isVip={member.isVip}
        />
      </Link>
    {:else}
      <ProfileImage
        --image-size="var(--ni-80)"
        --border-width="var(--border-thickness-xs)"
        name={member.name.first}
        src={member.avatar.url}
        isVip={member.isVip}
      />
    {/if}
  </div>

  <div class="team-member-info">
    <div class="team-member-names">
      {#if profileUrl}
        <Link href={profileUrl}>
          <span class="team-member-name">{displayName}</span>
        </Link>
      {:else}
        <span class="team-member-name">{displayName}</span>
      {/if}

      <span class="secondary team-member-username">@{member.username}</span>
    </div>

    {#if member.location}
      <span class="secondary team-member-location">{member.location}</span>
    {/if}

    {#if member.about}
      <p class="secondary team-member-bio">{member.about}</p>
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

    padding: var(--gap-xl);

    background: color-mix(
      in srgb,
      var(--color-card-background) 90%,
      transparent
    );
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
    border-radius: var(--border-radius-xxl);

    text-align: center;

    transition:
      border-color var(--transition-increment) ease-in-out,
      background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        border-color: color-mix(in srgb, var(--purple-500) 40%, transparent);
        background: color-mix(
          in srgb,
          var(--color-card-background) 95%,
          var(--purple-500) 5%
        );
      }
    }
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

  .team-member-username {
    font-size: var(--ni-12);
  }

  .team-member-location {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    &::before {
      content: "📍 ";
    }
  }

  .team-member-bio {
    font-size: var(--ni-12);
    margin-top: var(--gap-xxs);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
  }
</style>
