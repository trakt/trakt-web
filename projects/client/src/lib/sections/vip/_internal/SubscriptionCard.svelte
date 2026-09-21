<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipPlan } from "./models/VipPlan";
  import SubscriptionTag from "./SubscriptionTag.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";
  import { isTwoYearDealPlan } from "./utils/isTwoYearDealPlan";
  import { toVipPriceLabel } from "./utils/toVipPriceLabel";

  const { plan }: { plan: VipPlan } = $props();

  const splitPrice = (price: number) => {
    const isWholeNumber = price % 1 === 0;
    const formatted = toVipPriceLabel(price);

    if (isWholeNumber) {
      return { whole: formatted, cents: null };
    }

    const match = formatted.match(/^([^.]+)\.(\d+)$/);
    if (!match) {
      return { whole: formatted, cents: null };
    }

    return { whole: match[1], cents: match[2] };
  };

  const displayPrice = $derived(
    splitPrice(plan.discount ? plan.discount.discountedAmountMonthly : plan.monthlyPrice),
  );

  const dealPlan = $derived(isTwoYearDealPlan(plan) ? plan : null);

  const billedText = $derived.by(() => {
    if (dealPlan) {
      return m.text_vip_billed_deal_first_term({
        price: toVipPriceLabel(dealPlan.discount.discountedAmount),
        renewalPrice: toVipPriceLabel(dealPlan.totalPrice),
      });
    }

    const price = toVipPriceLabel(plan.discount?.discountedAmount ?? plan.totalPrice);
    switch (plan.type) {
      case "monthly":
        return m.text_vip_plan_billed_monthly({ price });
      case "yearly":
        return m.text_vip_plan_billed_yearly({ price });
      case "two_years":
        return m.text_vip_plan_billed_two_years({ price });
    }
  });
</script>

<article class="trakt-subscription-card">
  {#if dealPlan}
    <SubscriptionTag variant="highlight">{m.tag_text_deal_price()}</SubscriptionTag>
  {:else if plan.type === "two_years"}
    <SubscriptionTag variant="highlight">{m.tag_text_vip_best_value()}</SubscriptionTag>
  {:else if plan.isPopular}
    <SubscriptionTag variant="popular">
      {m.tag_text_most_popular()}
    </SubscriptionTag>
  {/if}

  <div class="trakt-subscription-container">
    <div class="trakt-subscription-pricing">
      <span class="price">{displayPrice.whole}{#if displayPrice.cents}<sup class="cents">{displayPrice.cents}</sup>{/if}<span class="per-month">/mo</span></span>

      <span class="billed-text">{billedText}</span>
    </div>

    <UpgradeButton {plan} />
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-subscription-card {
    box-sizing: border-box;
    width: 100%;

    position: relative;
    display: flex;
    justify-content: center;

    background: var(--background-subscription-card);

    box-shadow: var(--shadow-floating);

    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--shade-10) 10%, transparent);
  }

  .trakt-subscription-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--gap-l);

    padding: var(--ni-24) var(--ni-16) var(--ni-28);
    box-sizing: border-box;

    transition:
      padding,
      gap var(--transition-increment) ease-in-out;

    @include for-mobile {
      padding: var(--ni-24) var(--ni-18) var(--ni-28);
      gap: var(--gap-m);
    }
  }

  .trakt-subscription-pricing {
    --price-font-size: var(--ni-48);

    flex: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;

    .price {
      margin-top: var(--ni-12);
      font-size: var(--price-font-size);
      transition: font-size var(--transition-duration-short) ease-in-out;

      .cents {
        font-size: 0.5em;
        vertical-align: super;
      }

      .per-month {
        margin-inline-start: var(--ni-2);
        font-size: 0.5em;
      }
    }

    .billed-text {
      margin-top: var(--ni-8);
      font-size: var(--ni-14);
      opacity: 0.7;
    }

    @include for-tablet-sm-and-below {
      --price-font-size: var(--ni-36);
    }
  }
</style>
