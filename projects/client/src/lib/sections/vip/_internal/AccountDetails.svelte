<script lang="ts">
  import ThreadRing from "$lib/components/badge/ThreadRing.svelte";
  import UserTierBadge from "$lib/features/vip-veteran/UserTierBadge.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import { useCurrentUserTier } from "$lib/features/vip-veteran/stores/useCurrentUserTier.ts";
  import { useVipVeteranEnabled } from "$lib/features/vip-veteran/stores/useVipVeteranEnabled.ts";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import LifetimeBadge from "./LifetimeBadge.svelte";
  import SubscriptionActions from "./SubscriptionActions.svelte";
  import SubscriptionDetails from "./SubscriptionDetails.svelte";
  import { toMemberAuraTone } from "./utils/toMemberAuraTone";
  import VipContentContainer from "./VipContentContainer.svelte";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  const { user } = useUser();
  const { member } = useCurrentUserTier();
  const isVeteranEnabled = useVipVeteranEnabled();

  const auraTone = $derived(
    toMemberAuraTone({
      member: $member,
      isVeteranEnabled: $isVeteranEnabled,
    }),
  );

  const isLifeTime = $derived(subscription?.type === "life");
</script>

<VipContentContainer>
  <div class="trakt-account-details">
    <div class="trakt-vip-profile-header">
      <div class="member-avatar-stage" style:--member-aura={auraTone}>
        <span class="member-aura"></span>
        <span class="member-thread"><ThreadRing /></span>
        <ProfileImage
          --image-size="var(--ni-60)"
          --border-width="var(--border-thickness-xs)"
          name={$user.name.first}
          src={$user.avatar.url}
          member={$member}
          ringMotion="live"
        />
      </div>
      <div class="vip-header-details">
        <div class="vip-profile-header-user-details">
          <h1>{toDisplayableName($user)}</h1>
          <UserTierBadge member={$member} />
        </div>
        <div class="vip-profile-header-membership">
          {#if subscription?.memberSince}
            <p>
              {m.text_member_since({
                date: toHumanLongDate(subscription.memberSince, languageTag()),
              })}
            </p>
          {/if}

          {#if isLifeTime}
            <LifetimeBadge />
          {/if}
        </div>
      </div>
      {#if !isLifeTime && !$user.isDirector}
        <SubscriptionActions {subscription} />
      {/if}
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
    max-width: var(--ni-768);

    background: var(--color-card-background);
    box-shadow: var(--shadow-raised);

    border-radius: var(--border-radius-xxl);

    @media (prefers-reduced-motion: no-preference) {
      animation: vip-account-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
    }

    padding: var(--ni-24);
    box-sizing: border-box;

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

  .member-avatar-stage {
    position: relative;
    flex: none;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-72);
    height: var(--ni-72);

    .member-aura {
      position: absolute;
      inset: var(--ni-neg-18);

      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--member-aura) 50%, transparent),
        transparent 68%
      );

      pointer-events: none;

      @media (prefers-reduced-motion: no-preference) {
        animation: vip-member-breath 4s ease-in-out infinite;
      }
    }

    .member-thread {
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }
  }

  .vip-profile-header-user-details {
    :global(.trakt-vip-badge) {
      background: color-mix(in srgb, var(--vip-badge-glow) 25%, transparent);
      color: var(--color-text-primary);
      box-shadow: none;
    }

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

  @keyframes vip-account-rise {
    from {
      opacity: 0;
      transform: translateY(var(--ni-16));
    }
  }

  @keyframes vip-member-breath {
    0%,
    100% {
      opacity: 0.7;
      transform: scale(0.92);
    }

    50% {
      opacity: 1;
      transform: scale(1.06);
    }
  }

  .vip-header-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    flex: 1;
  }

  .vip-profile-header-membership {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
