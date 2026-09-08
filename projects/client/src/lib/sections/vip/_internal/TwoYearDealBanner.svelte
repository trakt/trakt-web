<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import { useVip } from "./useVip";
  import { toVipPriceLabel } from "./utils/toVipPriceLabel";

  const { plans } = useVip();

  // A first-term-only discount on the 2 year plan is a deal (former VIP rejoin
  // or PayPal switch); the always-on v3 Lite discount is not first-term-only.
  const dealPlan = $derived(
    $plans.find(
      (plan) => plan.type === "two_years" && plan.discount?.firstTermOnly,
    ),
  );
</script>

{#if dealPlan?.discount}
  <div class="trakt-two-year-deal-banner">
    <h2>{m.header_vip_two_year_deal()}</h2>
    <p>
      {m.text_vip_two_year_deal({
        price: toVipPriceLabel(dealPlan.discount.discountedAmount),
        renewalPrice: toVipPriceLabel(dealPlan.totalPrice),
      })}
    </p>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-two-year-deal-banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    text-align: center;

    width: 100%;
    max-width: var(--ni-620);

    @include vip-glow-card;

    border: var(--ni-1) solid var(--color-vip-border-accent);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-18) var(--ni-24);
    box-sizing: border-box;

    margin-top: var(--ni-24);

    h2 {
      font-size: var(--ni-18);
    }

    p {
      margin: 0;
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }

    @include for-mobile {
      max-width: var(--ni-280);
    }
  }
</style>
