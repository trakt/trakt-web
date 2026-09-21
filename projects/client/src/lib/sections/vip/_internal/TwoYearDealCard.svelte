<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipDealPlan } from "./models/VipDealPlan";
  import SubscriptionTag from "./SubscriptionTag.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";
  import { useVip } from "./useVip";
  import { isPaypalGateway } from "./utils/isPaypalGateway";
  import { toVipPriceLabel } from "./utils/toVipPriceLabel";

  const { plan }: { plan: VipDealPlan } = $props();

  const { subscription } = useVip();

  // A cancelled PayPal subscription is already gone, so its owner is coming
  // back rather than switching.
  const isPaypalSwitch = $derived(
    isPaypalGateway($subscription?.gateway) && !$subscription?.isCancelled,
  );

  const price = $derived(toVipPriceLabel(plan.discount.discountedAmount));
  const renewalPrice = $derived(toVipPriceLabel(plan.totalPrice));

  const copy = $derived(
    isPaypalSwitch
      ? {
        eyebrow: m.tag_text_vip_deal_paypal_switch(),
        header: m.header_vip_deal_paypal_switch({ price }),
        description: m.text_vip_deal_paypal_switch({ price, renewalPrice }),
      }
      : {
        eyebrow: m.tag_text_vip_deal_welcome_back(),
        header: m.header_vip_deal_welcome_back({ price }),
        description: m.text_vip_deal_welcome_back({ price, renewalPrice }),
      },
  );
</script>

<section class="trakt-two-year-deal-card">
  <SubscriptionTag variant="highlight">{m.tag_text_deal_price()}</SubscriptionTag>

  <div class="deal-copy">
    <p class="deal-eyebrow tag bold uppercase">{copy.eyebrow}</p>
    <h2 class="deal-header">{copy.header}</h2>
    <p class="deal-description secondary">{copy.description}</p>
  </div>

  <div class="deal-offer">
    <span class="deal-price">{price}</span>
    <span class="deal-term bold">{m.text_vip_deal_term()}</span>
    <UpgradeButton {plan} label={m.button_label_vip_claim_deal()}>
      {m.button_text_vip_claim_deal()}
    </UpgradeButton>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-two-year-deal-card {
    position: relative;

    width: 100%;
    max-width: var(--ni-768);

    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--gap-l);

    @include vip-glow-card;

    border: var(--ni-1) solid var(--color-vip-border-accent);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-28) var(--ni-32);
    box-sizing: border-box;

    margin-top: var(--ni-24);

    @include for-tablet-sm-and-below {
      padding: var(--ni-24);
    }

    @include for-mobile {
      max-width: var(--ni-280);

      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
      gap: var(--gap-m);

      text-align: center;
      padding: var(--ni-24) var(--ni-18);
      margin-top: var(--ni-8);
    }
  }

  .deal-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding-inline-end: var(--ni-12);

    @include for-mobile {
      align-items: center;
      padding-inline-end: 0;
    }
  }

  .deal-eyebrow {
    color: var(--color-text-emphasis);
    letter-spacing: 0.12em;
  }

  .deal-header {
    font-size: var(--ni-28);
    line-height: 1.15;
    text-wrap: balance;

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }

  .deal-offer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    text-align: center;
  }

  .deal-price {
    font-size: var(--ni-44);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .deal-term {
    font-size: var(--font-size-title);
  }
</style>
