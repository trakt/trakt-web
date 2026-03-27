<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanCurrency } from "$lib/utils/formatting/currency/toHumanCurrency";
  import type { VipPlan } from "./models/VipPlan";
  import MostPopularTag from "./MostPopularTag.svelte";
  import { useVip } from "./useVip";

  const {
    plan,
    variant = "default",
  }: { plan: VipPlan; variant?: "default" | "elevated" } = $props();

  const { startCheckout, isFetching } = useVip();

  const onCardClick = async () => {
    if ($isFetching) return;
    const url = await startCheckout(plan);
    if (url) {
      globalThis.window.location.href = url;
    }
  };

  const hasDiscount = $derived(plan.discount != null);

  const formatCurrency = (price: number) =>
    toHumanCurrency({ price, currency: "usd", locale: languageTag() });

  const splitPrice = (price: number) => {
    const isWholeNumber = price % 1 === 0;
    const formatted = formatCurrency(price);

    if (isWholeNumber) {
      return { whole: formatted, cents: null };
    }

    const match = formatted.match(/^([^.]+)\.(\d+)$/);
    if (!match) {
      return { whole: formatted, cents: null };
    }

    return { whole: match[1], cents: match[2] };
  };

  const originalPrice = $derived(formatCurrency(plan.monthlyPrice));

  const displayPrice = $derived(
    splitPrice(
      plan.discount ? plan.discount.discountedAmountMonthly : plan.monthlyPrice,
    ),
  );

  const discountPillText = $derived.by(() => {
    if (!hasDiscount) return null;

    switch (plan.type) {
      case "monthly":
        return m.tag_text_discount_monthly();
      case "yearly":
        return m.tag_text_discount_yearly();
      case "two_years":
        return m.tag_text_discount_biyearly();
    }
  });

  const billedText = $derived.by(() => {
    switch (plan.type) {
      case "monthly":
        return m.text_vip_billed_monthly();
      case "yearly":
        return m.text_vip_billed_yearly();
      case "two_years":
        return m.text_vip_billed_biyearly();
    }
  });
</script>

<button
  class="trakt-subscription-card"
  data-variant={variant}
  onclick={onCardClick}
  aria-label={m.button_label_vip_upgrade()}
>
  {#if plan.isPopular}
    <MostPopularTag />
  {/if}

  <div class="trakt-subscription-container">
    <div class="trakt-subscription-pricing">
      {#if hasDiscount}
        <span class="original-price">{originalPrice}/mo</span>
      {/if}

      {#if discountPillText}
        <div class="discount-pill">
          <TextTag><p>{discountPillText}</p></TextTag>
        </div>
      {/if}

      <span class="price">
        {displayPrice.whole}
        {#if displayPrice.cents}
          <sup class="cents">{displayPrice.cents}</sup>
        {/if}
        <span class="per-month">/mo</span>
      </span>

      <span class="billed-text">{billedText}</span>
    </div>

    <div class="trakt-upgrade-label" data-variant={variant}>
      <span class="bold uppercase">{m.button_text_vip_upgrade()}</span>
    </div>
  </div>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-subscription-card {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    text-align: inherit;

    position: relative;
    display: flex;
    justify-content: center;
    cursor: pointer;

    background: var(--background-subscription-card);

    box-shadow: var(--shadow-floating);

    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--shade-10) 10%, transparent);

    transform: scale(1);
    transition:
      transform var(--transition-duration-short) ease-in-out,
      background var(--transition-duration-short) ease-in-out,
      border-color var(--transition-duration-short) ease-in-out,
      box-shadow var(--transition-duration-short) ease-in-out;

    &[data-variant="elevated"] {
      transform: scale(1.1);
      border: var(--ni-1) solid var(--shade-10);
      background: var(--background-vip-elevated-card);
      box-shadow: var(--shadow-raised);
    }
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

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;

    .original-price {
      font-size: var(--font-size-body);
      text-decoration: line-through;
      opacity: 0.6;
    }

    .discount-pill {
      margin: var(--ni-8) 0;

      :global(.trakt-text-tag) {
        background: var(--color-vip-discount-pill-background);
        border-radius: var(--ni-4);
        padding: var(--ni-4) var(--ni-12);
        color: var(--color-vip-discount-pill);
      }

      p {
        text-transform: uppercase;
        font-weight: bold;
      }
    }

    .price {
      margin-top: var(--ni-12);
      font-size: var(--price-font-size);
      transition: font-size var(--transition-duration-short) ease-in-out;

      .cents {
        font-size: 0.5em;
        vertical-align: super;
      }

      .per-month {
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

  .trakt-upgrade-label {
    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--ni-40);
    padding: 0 var(--ni-16);
    box-sizing: border-box;

    background: var(--color-vip-surface-muted);
    color: var(--color-text-primary);
    border: var(--ni-1) solid var(--color-vip-border-accent);
    border-radius: var(--border-radius-m);

    font-size: var(--font-size-text);

    pointer-events: none;
    transition: background-color var(--transition-duration-short) ease-in-out;

    span {
      font-size: 0.75rem;
    }

    &[data-variant="elevated"] {
      background: var(--red-500);
      color: var(--shade-10);
      border: none;
    }
  }
</style>
