<script lang="ts">
  import { toVipPriceLabel } from "./utils/toVipPriceLabel";

  const { amount }: { amount: number } = $props();

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

  const displayPrice = $derived(splitPrice(amount));
</script>

<span class="trakt-vip-monthly-price"
  >{displayPrice.whole}{#if displayPrice.cents}<sup class="cents"
      >{displayPrice.cents}</sup
    >{/if}<span class="per-month">/mo</span></span
>

<style lang="scss">
  .trakt-vip-monthly-price {
    font-size: var(--price-font-size, var(--ni-48));
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
</style>
