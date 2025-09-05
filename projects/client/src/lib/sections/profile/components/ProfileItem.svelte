<script lang="ts">
  import { dPadTrigger } from "$lib/components/card/_internal/dPadTrigger";
  import Link from "$lib/components/link/Link.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { profile }: { profile: UserProfile } = $props();
  const { navigation } = useNavigation();
</script>

<div
  class="trakt-profile-item"
  role="button"
  tabindex="0"
  data-dpad-navigation={DpadNavigationType.Item}
  data-navigation-type={$navigation}
  use:dPadTrigger={".trakt-link"}
>
  <Link
    focusable={false}
    href={UrlBuilder.profile.user(profile.slug ?? "")}
    color="inherit"
  >
    <ProfileImage
      --width="var(--ni-64)"
      --height="var(--ni-64)"
      --border-width="var(--border-thickness-xs)"
      name={profile.name.first}
      src={profile.avatar.url}
      isVip={profile.isVip}
    />
  </Link>
  <div class="profile-footer">
    <p class="meta-info ellipsis">{profile.username}</p>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;

    gap: var(--gap-xs);

    width: var(--width-profile-item);
    height: var(--height-profile-item);

    padding: var(--ni-10) var(--ni-0);
    box-sizing: border-box;

    overflow: hidden;

    &[data-navigation-type="dpad"] {
      &:focus-within {
        outline: var(--border-thickness-xs) solid var(--color-link-active);
        outline-offset: calc(-1 * var(--border-thickness-xs));

        border-radius: var(--border-radius-s);
      }
    }
  }

  .trakt-profile-item {
    :global(.profile-image-container.is-vip)::before {
      --offset: calc(-1 * var(--border-thickness-s));

      content: "";
      position: absolute;
      opacity: 0;

      top: var(--offset);
      left: var(--offset);
      right: var(--offset);
      bottom: var(--offset);

      background: conic-gradient(
        from 0deg,
        transparent 0deg,
        var(--color-border-vip-avatar) 45deg,
        transparent 90deg
      );

      border-radius: 50%;
      z-index: var(--layer-background);
    }

    :global(.profile-image-container) {
      background-color: var(--color-card-background);
      border-radius: 50%;

      :global(.profile-image) {
        transition: outline var(--transition-increment) ease-in-out;
      }

      :global(.vip-badge) {
        transition: var(--transition-increment) ease-in-out;
        transition-property: transform;
        transform-origin: center;
      }

      @include for-mouse {
        &:hover {
          :global(.profile-image) {
            outline: var(--border-thickness-s) solid var(--color-border-avatar);
          }

          :global(.vip-badge) {
            transform: scale(1.15);
          }

          &::before {
            animation: fade-rotate calc(4 * var(--transition-increment))
              ease-in-out;
          }
        }
      }
    }
  }

  .profile-footer {
    display: flex;
    justify-content: center;

    width: 100%;
    padding: 0 var(--ni-4);
    box-sizing: border-box;
  }
</style>
