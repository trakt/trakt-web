<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import LifetimeBadge from "./LifetimeBadge.svelte";
  import SubscriptionDetails from "./SubscriptionDetails.svelte";
  import VipContentContainer from "./VipContentContainer.svelte";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  const { user } = useUser();

  const isLifeTime = $derived(subscription?.type === "life");
</script>

<VipContentContainer>
  <div class="trakt-account-details">
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
        <div class="vip-profile-header-membership">
          {#if subscription?.memberSince}
            <p>
              {m.text_member_since({
                date: toHumanDay({ date: subscription.memberSince, locale: getLocale() }),
              })}
            </p>
          {/if}

          {#if isLifeTime}
            <LifetimeBadge />
          {/if}
        </div>
      </div>
    </div>

    {#if !isLifeTime && !$user.isDirector}
      <div class="vip-subscription-details">
        <SubscriptionDetails {subscription} />
      </div>
    {/if}
  </div>
</VipContentContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-account-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    width: 100%;
    max-width: var(--ni-640);

    background-color: var(--color-card-background);

    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-24);
    box-sizing: border-box;

    box-shadow: var(--shadow-raised);

    :global(.trakt-link) {
      text-decoration: none;
    }

    transition: var(--transition-increment) ease-in-out;
    transition-property: padding;

    @include for-tablet-sm-and-below {
      padding: var(--ni-18);
    }
  }

  .trakt-vip-profile-header {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .vip-profile-header-user-details {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

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

  .vip-profile-header-membership {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
