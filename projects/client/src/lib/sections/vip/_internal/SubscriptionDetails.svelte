<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import PaymentMethodDetail from "./PaymentMethodDetail.svelte";
  import SubscriptionDetail from "./SubscriptionDetail.svelte";
  import { toVipDurationLabel } from "./utils/toVipDurationLabel";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  // The renewal price already reads "$60.00 per year", so it stands in for the
  // plan on its own; fall back to the duration when no price is available.
  const planText = $derived(
    subscription?.renewalPrice?.readable ??
      toVipDurationLabel(subscription?.type) ??
      undefined,
  );
</script>

{#if subscription}
  <div class="trakt-vip-subscription-details">
    {#if subscription.renewsAt}
      <SubscriptionDetail title={m.header_renewal_date()}>
        {#snippet icon()}
          <CalendarIcon />
        {/snippet}
        {toHumanDay({ date: subscription.renewsAt, locale: getLocale() })}
      </SubscriptionDetail>
    {:else if subscription.expiresAt}
      <SubscriptionDetail title={m.header_expiration_date()}>
        {#snippet icon()}
          <CalendarIcon />
        {/snippet}
        {toHumanDay({ date: subscription.expiresAt, locale: getLocale() })}
      </SubscriptionDetail>
    {/if}

    {#if planText}
      <SubscriptionDetail title={m.header_current_plan()}>
        {#snippet icon()}
          <CrownIcon />
        {/snippet}
        {planText}
      </SubscriptionDetail>
    {/if}

    <PaymentMethodDetail {subscription} />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-subscription-details {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--gap-l) var(--gap-xl);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      gap: var(--gap-m);
    }
  }
</style>
