<script lang="ts">
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ProfileImage from "../../profile-banner/ProfileImage.svelte";
  import VipBadge from "./VIPBadge.svelte";

  const { user } = useUser();
</script>

<trakt-profile-button data-hj-suppress data-sentry-mask>
  <Link
    href={UrlBuilder.profile.me()}
    label={m.button_label_user_profile()}
    navigationType={DpadNavigationType.Item}
  >
    <div class="profile-icon" class:is-vip={Boolean($user?.isVip)}>
      <ProfileImage
        --width="var(--ni-32)"
        --height="var(--ni-32)"
        --border-width="var(--border-thickness-xs)"
        name={$user?.name?.first ?? ""}
        src={$user?.avatar?.url ?? ""}
      />
      <RenderFor audience="vip">
        <VipBadge style="inverted" />
      </RenderFor>
    </div>
    <div class="profile-info">
      <p class="profile-name ellipsis">{$user?.name?.first}</p>
      <p class="meta-info ellipsis">{m.link_text_view_profile()}</p>
    </div>
  </Link>
  <RenderFor audience="authenticated" navigation="default">
    <SettingsButton style="ghost" />
  </RenderFor>
</trakt-profile-button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-profile-button {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-xxs);

    :global(.trakt-link) {
      height: var(--ni-40);

      display: flex;
      align-items: center;
      gap: var(--gap-s);

      text-decoration: none;

      &:hover,
      &:focus-visible {
        :global(.meta-info) {
          color: inherit;
        }
      }

      &:focus-visible {
        border-radius: var(--border-radius-xs);
        outline: var(--border-thickness-xs) solid var(--color-link-active);
        outline-offset: var(--gap-xs);
      }
    }

    @include for-tablet-sm-and-below {
      .profile-info,
      :global(.trakt-action-button) {
        display: none;
      }
    }
  }

  .profile-info {
    display: flex;
    flex-direction: column;

    .profile-name {
      line-height: 150%;
      max-width: var(--ni-300);
    }

    .meta-info {
      transition: color var(--transition-increment) ease-in-out;

      line-height: 90%;
      color: var(--color-text-secondary);
    }
  }

  .profile-icon {
    position: relative;

    &.is-vip {
      padding-right: var(--ni-8);
    }

    :global(.vip-badge) {
      width: var(--ni-24);
      height: auto;

      position: absolute;
      top: var(--ni-neg-10);
      right: var(--ni-neg-4);

      z-index: var(--layer-raised);
    }
  }
</style>
