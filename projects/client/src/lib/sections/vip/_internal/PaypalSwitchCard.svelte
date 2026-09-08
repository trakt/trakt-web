<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useVip } from "./useVip";
  import { isPaypalGateway } from "./utils/isPaypalGateway";
  import { toVipPriceLabel } from "./utils/toVipPriceLabel";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  const { plans } = useVip();

  const isPaypal = $derived(isPaypalGateway(subscription?.gateway));

  // On the manage page a discounted 2-year plan can only be the PayPal switch
  // deal, so surface its pricing when the API returns one.
  const dealPlan = $derived(
    $plans.find((plan) => plan.type === "two_years" && plan.discount != null),
  );
</script>

{#if isPaypal}
  <div class="trakt-paypal-switch-card">
    <div class="switch-copy">
      <h2>{m.header_vip_paypal_switch()}</h2>
      <p>{m.text_vip_paypal_switch()}</p>
    </div>

    <div class="switch-action">
      {#if dealPlan?.discount}
        <div class="switch-price">
          <span class="price">
            {toVipPriceLabel(dealPlan.discount.discountedAmountMonthly)}
            <span class="per-month">/mo</span>
          </span>
          <span class="billed-text">{m.text_vip_billed_biyearly()}</span>
        </div>
      {/if}
      <Button
        size="small"
        label={m.button_label_vip_paypal_switch()}
        color="custom"
        variant="primary"
        style="flat"
        text="uppercase"
        href={UrlBuilder.renewVip()}
      >
        {m.button_text_vip_paypal_switch()}
      </Button>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-paypal-switch-card {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-l);

    width: 100%;
    max-width: var(--ni-768);

    @include vip-glow-card;

    border: var(--ni-1) solid var(--color-vip-border-accent);
    border-radius: var(--border-radius-xxl);

    padding: var(--ni-24);
    box-sizing: border-box;

    @include for-tablet-sm-and-below {
      padding: var(--ni-18);
    }
  }

  .switch-copy {
    flex: 1 1 var(--ni-280);

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    h2 {
      font-size: var(--ni-20);
    }

    p {
      margin: 0;
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }
  }

  .switch-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    margin: 0 auto;

    .switch-price {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .price {
      font-size: var(--ni-28);
      font-variant-numeric: tabular-nums;

      .per-month {
        font-size: 0.5em;
      }
    }

    .billed-text {
      font-size: var(--ni-12);
      opacity: 0.7;
    }

    :global(.trakt-button) {
      --color-background-custom: var(--purple-500);
      --color-foreground-custom: var(--shade-10);
    }
  }
</style>
