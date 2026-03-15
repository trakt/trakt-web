<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import SubscriptionDetail from "./SubscriptionDetail.svelte";

  const { subscription }: { subscription: VipSubscription } = $props();

  const durationText = $derived.by(() => {
    switch (subscription.type) {
      case "monthly":
        return m.text_vip_billing_cycle_monthly();
      case "yearly":
        return m.text_vip_billing_cycle_year({ years: 1 });
      case "two_years":
        return m.text_vip_billing_cycle_year({ years: 2 });
    }
  });
</script>

<div class="trakt-vip-subscription-status">
  {#if subscription.renewsAt}
    <SubscriptionDetail title={m.header_renewal_date()}>
      {#snippet icon()}
        <CalendarIcon />
      {/snippet}
      {toHumanDay(subscription.renewsAt, getLocale())}
    </SubscriptionDetail>
  {/if}

  {#if !subscription.renewsAt && subscription.expiresAt}
    <SubscriptionDetail title={m.header_expiration_date()}>
      {#snippet icon()}
        <CalendarIcon />
      {/snippet}
      {toHumanDay(subscription.expiresAt, getLocale())}
    </SubscriptionDetail>
  {/if}

  {#if durationText}
    <SubscriptionDetail title={m.header_current_plan()}>
      {#snippet icon()}
        <CrownIcon />
      {/snippet}
      {durationText}
    </SubscriptionDetail>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-subscription-status {
    display: flex;
    align-items: center;
    gap: var(--gap-xxl);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: stretch;

      gap: var(--gap-s);
    }
  }
</style>
