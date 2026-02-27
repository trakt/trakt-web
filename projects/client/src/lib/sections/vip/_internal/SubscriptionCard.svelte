<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanCurrency } from "$lib/utils/formatting/currency/toHumanCurrency";
  import type { VipPlan } from "./models/VipPlan";
  import MostPopularTag from "./MostPopularTag.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";

  const { plan }: { plan: VipPlan } = $props();

  const monthlyCostText = $derived(`$${plan.monthlyPrice}`);

  const totalCostText = $derived(
    toHumanCurrency({
      price: plan.monthlyPrice * plan.durationInMonths,
      currency: "usd",
      locale: languageTag(),
    }),
  );

  const billingCycleText = $derived.by(() => {
    switch (plan.type) {
      case "monthly":
        return m.text_vip_billing_monthly({ price: totalCostText });
      case "yearly":
        return m.text_vip_billing_yearly({ price: totalCostText });
      case "two_years":
        return m.text_vip_billing_biyearly({ price: totalCostText });
    }
  });

  const durationText = $derived.by(() => {
    switch (plan.type) {
      case "monthly":
        return m.text_vip_billing_cycle_monthly();
      case "yearly":
      case "two_years":
        return m.text_vip_billing_cycle_year({
          years: plan.durationInMonths / 12,
        });
    }
  });
</script>

<div class="trakt-subscription-card" class:is-popular={plan.isPopular}>
  {#if plan.isPopular}
    <MostPopularTag />
  {/if}

  <div class="trakt-subscription-container">
    <div class="trakt-subscription-title">
      <span class="price">{`${monthlyCostText}/mo`}</span>
      <span class="billing-cycle secondary">
        {billingCycleText}
      </span>
    </div>

    <UpgradeButton {plan} />

    <div class="trakt-subscription-footer">
      <span class="secondary bold">
        {durationText}
      </span>
      <span class="secondary">{m.text_vip_subscription()}</span>
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-subscription-card {
    /* --subscription-main-color: var(--shade-920);
    --subscription-accent-color: var(--shade-1000); */

    --subscription-main-color: var(--shade-20);
    --subscription-accent-color: var(--shade-100);

    position: relative;
    display: flex;
    justify-content: center;

    min-height: var(--ni-272);

    background: radial-gradient(
      ellipse 110% 125% at 8% 100%,
      var(--subscription-main-color) 0%,
      var(--subscription-accent-color) 100%
    );

    box-shadow: var(--shadow-raised);

    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--shade-10) 10%, transparent);

    &.is-popular {
      /* --subscription-main-color: var(--red-950); */
      --subscription-accent-color: color-mix(
        in srgb,
        var(--red-950) 10%,
        var(--shade-10)
      );

      transform: translateY(calc(-1 * var(--ni-24)));
      transition: transform var(--transition-duration-short) ease-in-out;

      border: var(--ni-1) solid var(--shade-10);
    }

    @include for-tablet-sm-and-below {
      min-height: var(--ni-204);

      &.is-popular {
        transform: translateY(calc(-1 * var(--ni-12)));
      }
    }

    @include for-mobile {
      &.is-popular {
        transform: translateY(0);
      }
    }
  }

  .trakt-subscription-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-24);
    box-sizing: border-box;

    transition:
      padding,
      gap var(--transition-increment) ease-in-out;

    @include for-mobile {
      padding: var(--ni-18);
      gap: var(--gap-s);
    }
  }

  .trakt-subscription-title {
    --price-font-size: var(--ni-48);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    text-align: center;

    .price {
      font-size: var(--price-font-size);
      transition: font-size var(--transition-duration-short) ease-in-out;
    }

    @include for-tablet-sm-and-below {
      --price-font-size: var(--ni-36);
    }
  }

  .trakt-subscription-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
