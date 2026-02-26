<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import VipContentContainer from "./VipContentContainer.svelte";

  const { user } = useUser();

  const { track } = useTrack(AnalyticsEvent.VipManage);
</script>

<VipContentContainer>
  <div class="trakt-vip-profile-header">
    <ProfileImage
      --image-size="var(--ni-64)"
      --border-width="var(--border-thickness-xs)"
      name={$user.name.first}
      src={$user.avatar.url}
      isVip={$user.isVip}
    />
    <div class="vip-header-details">
      <div class="vip-profile-header-user-details">
        <h1>{toDisplayableName($user)}</h1>
        <VipBadge isDirector={$user.isDirector} />
      </div>
      <Link href={UrlBuilder.og.vip()} target="_blank" onclick={() => track()}>
        <div class="manage-subscription">
          <GearIcon /><span class="secondary">Manage subscription</span>
        </div>
      </Link>
    </div>
  </div>
</VipContentContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-profile-header {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .vip-profile-header-user-details {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    h1 {
      font-size: var(--ni-32);

      @include for-mobile {
        font-size: var(--ni-24);
      }
    }
  }

  .vip-header-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .manage-subscription {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
