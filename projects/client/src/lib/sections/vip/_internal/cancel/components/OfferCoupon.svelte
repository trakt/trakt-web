<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate.ts";
  import SubscriptionTag from "../../SubscriptionTag.svelte";
  import { toVipPriceLabel } from "../../utils/toVipPriceLabel.ts";
  import type { OfferCouponProps } from "./OfferCouponProps.ts";
  import VipCancelButton from "./VipCancelButton.svelte";

  const { offer, reason, startsAt, onClaim, isActive, isBusy }: OfferCouponProps =
    $props();

  const price = $derived(toVipPriceLabel(offer.discountedAmount));
  const date = $derived(toHumanShortDate(startsAt, languageTag()));
  const finePrint = $derived(
    reason === "break"
      ? m.text_vip_cancel_offer_break({ date })
      : m.text_vip_cancel_offer_monthly({
          price: toVipPriceLabel(offer.monthlyAmount),
          date,
        }),
  );
</script>

<section class="trakt-vip-cancel-offer-coupon" class:is-active={isActive}>
  <SubscriptionTag variant="highlight">
    {offer.source === "campaign"
      ? m.tag_text_vip_cancel_campaign()
      : m.tag_text_vip_cancel_offer()}
  </SubscriptionTag>

  <div class="coupon-copy">
    <h2 class="coupon-title">{m.header_vip_cancel_offer()}</h2>
    <p class="coupon-fine-print small">{finePrint}</p>
  </div>

  <p class="coupon-price">
    <span class="coupon-amount">{price}</span>
    <s class="coupon-was small">{toVipPriceLabel(offer.totalPrice)}</s>
  </p>

  <div class="coupon-action">
    <VipCancelButton
      look="primary"
      label={m.button_label_vip_cancel_claim()}
      onclick={onClaim}
      disabled={isBusy}
    >
      {m.button_text_vip_cancel_claim({ price })}
    </VipCancelButton>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-offer-coupon {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--gap-m) var(--ni-18);

    margin-block-start: var(--ni-28);
    padding: var(--ni-24);
    border-radius: var(--border-radius-xl);

    @include vip-glow-card;
    border-color: var(--color-vip-border-accent);

    &.is-active {
      animation: coupon-in 600ms cubic-bezier(0.3, 1.5, 0.5, 1) 550ms both;
    }

    @container vip-cancel (max-width: 760px) {
      padding: var(--ni-20) var(--ni-16) var(--ni-16);
      gap: var(--gap-s);
    }
  }

  .coupon-copy {
    display: grid;
    gap: var(--gap-xxs);
    min-width: 0;
  }

  .coupon-title {
    margin: 0;
    font-size: var(--ni-22);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.03em;
    text-wrap: balance;

    @container vip-cancel (max-width: 760px) {
      font-size: var(--ni-18);
    }
  }

  .coupon-fine-print {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .coupon-price {
    margin: 0;
    display: grid;
    justify-items: end;
  }

  .coupon-amount {
    font-size: var(--ni-44);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;

    @container vip-cancel (max-width: 760px) {
      font-size: var(--ni-32);
    }
  }

  .coupon-was {
    color: var(--color-text-secondary);
  }

  .coupon-action {
    grid-column: 1 / -1;
    display: grid;
  }

  @keyframes coupon-in {
    from {
      opacity: 0;
      transform: scale(1.06);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-cancel-offer-coupon.is-active {
      animation: none;
    }
  }
</style>
