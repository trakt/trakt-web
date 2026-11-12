<script lang="ts">
  import ThreadRing from "$lib/components/badge/ThreadRing.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TicketPair from "$lib/features/promotions/TicketPair.svelte";
  import { toHumanOfferEnd } from "$lib/features/promotions/toHumanOfferEnd";
  import { toPromotionUpsellSource } from "$lib/features/upsell/toPromotionUpsellSource";
  import type { PromotionOffer } from "$lib/requests/models/PromotionOffer";
  import type { VipDealPlan } from "./models/VipDealPlan";
  import SubscriptionTag from "./SubscriptionTag.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";
  import VipMonthlyPrice from "./VipMonthlyPrice.svelte";
  import { toVipPriceLabel } from "./utils/toVipPriceLabel";

  const {
    plan,
    isPaypalSwitch,
    isEmphasized = false,
    offer = null,
  }: {
    plan: VipDealPlan;
    isPaypalSwitch: boolean;
    isEmphasized?: boolean;
    offer?: PromotionOffer | null;
  } = $props();

  const promotion = $derived(isPaypalSwitch ? null : offer);

  const revealWhenEmphasized = (node: HTMLElement, emphasized: boolean) => {
    if (!emphasized) return;
    node.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const promotionEnd = $derived(
    promotion
      ? toHumanOfferEnd({
          endsAt: promotion.endsAt,
          now: new Date(),
          locale: languageTag(),
        })
      : null,
  );

  const price = $derived(toVipPriceLabel(plan.discount.discountedAmount));
  const renewalPrice = $derived(toVipPriceLabel(plan.totalPrice));
</script>

<section
  class="trakt-two-year-deal-card"
  class:is-emphasized={isEmphasized}
  class:has-promotion={promotion != null}
  use:revealWhenEmphasized={isEmphasized}
>
  <ThreadRing opacity={0.9} />

  {#if promotion}
    <div class="deal-promotion-tags">
      <span class="deal-promotion-name">{promotion.name}</span>
      <span class="deal-promotion-ends">{promotionEnd}</span>
    </div>

    <div class="deal-tickets">
      <TicketPair label={promotion.label} />
    </div>
  {:else}
    <SubscriptionTag variant="highlight"
      >{m.tag_text_deal_price()}</SubscriptionTag
    >
  {/if}

  <div class="deal-copy">
    <p class="deal-eyebrow tag bold uppercase">
      {#if isPaypalSwitch}
        {m.tag_text_vip_deal_paypal_switch()}
      {:else if promotion}
        <span class="deal-eyebrow-term">{m.tag_text_deal_price()}</span>
        <span class="deal-eyebrow-ends">{promotionEnd}</span>
      {:else}
        {m.tag_text_vip_deal_limited_offer()}
      {/if}
    </p>
    <h2 class="deal-header">
      {isPaypalSwitch
        ? m.header_vip_deal_paypal_switch({ price })
        : m.header_vip_deal_limited_offer({ price })}
    </h2>
    <p class="deal-description secondary">
      {isPaypalSwitch
        ? m.text_vip_deal_paypal_switch({ price, renewalPrice })
        : m.text_vip_deal_limited_offer({ price, renewalPrice })}
    </p>
  </div>

  <div class="deal-offer">
    {#if promotion}
      <span class="deal-monthly"
        ><VipMonthlyPrice
          amount={plan.discount.discountedAmountMonthly}
        /></span
      >
    {:else}
      <span class="deal-price">{price}</span>
      <span class="deal-term bold">{m.text_vip_deal_term()}</span>
    {/if}
    <UpgradeButton
      {plan}
      label={m.button_label_vip_claim_deal()}
      source={promotion ? toPromotionUpsellSource(promotion) : undefined}
    >
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

    border: none;
    box-shadow:
      0 var(--ni-14) var(--ni-40)
        color-mix(in srgb, var(--purple-500) 28%, transparent),
      var(--shadow-floating);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-28) var(--ni-32);
    box-sizing: border-box;

    margin-top: var(--ni-24);

    &.is-emphasized {
      box-shadow:
        0 var(--ni-18) var(--ni-56)
          color-mix(in srgb, var(--purple-500) 48%, transparent),
        var(--shadow-floating);
    }

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

    .deal-eyebrow-ends {
      display: none;
    }

    @include for-mobile {
      .deal-eyebrow-term {
        display: none;
      }

      .deal-eyebrow-ends {
        display: inline;
      }
    }
  }

  .deal-header {
    font-size: var(--ni-28);
    line-height: 1.15;
    text-wrap: balance;

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }

  .deal-description {
    text-wrap: balance;
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

  .deal-monthly {
    --price-font-size: var(--ni-48);
  }

  .trakt-two-year-deal-card.has-promotion {
    margin-top: var(--ni-40);
    outline: var(--border-thickness-xxs) solid var(--purple-500);
  }

  .deal-promotion-tags {
    position: absolute;
    top: 0;
    inset-inline-start: var(--ni-32);
    translate: 0 -50%;

    display: flex;
    gap: var(--gap-xs);

    @include for-mobile {
      inset-inline-start: 50%;
      translate: calc(var(--rtl-sign, 1) * -50%) -50%;
    }
  }

  .deal-promotion-name,
  .deal-promotion-ends {
    padding: var(--ni-4) var(--ni-12);
    border-radius: var(--border-radius-pill);

    font-size: var(--font-size-text-small);
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .deal-promotion-name {
    background: var(--shade-10);
    color: var(--shade-1000);
  }

  .deal-promotion-ends {
    background: var(--purple-500);
    color: var(--shade-10);

    @include for-mobile {
      display: none;
    }
  }

  .deal-tickets {
    --ticket-pair-size: var(--ni-8);

    position: absolute;
    top: var(--ni-neg-32);
    inset-inline-end: var(--ni-neg-16);

    pointer-events: none;

    @include for-mobile {
      display: none;
    }
  }
</style>
