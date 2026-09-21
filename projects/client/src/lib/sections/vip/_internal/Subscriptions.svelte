<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import TraktIcon from "./icons/TraktIcon.svelte";
  import SubscriptionCard from "./SubscriptionCard.svelte";
  import TwoYearDealCard from "./TwoYearDealCard.svelte";
  import { useVip } from "./useVip";
  import { findTwoYearDealPlan } from "./utils/findTwoYearDealPlan";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipHeader from "./VipHeader.svelte";

  const { plans } = useVip();

  const activePlans = $derived($plans.length > 0 ? $plans : VIP_PLANS);

  const dealPlan = $derived(findTwoYearDealPlan(activePlans));
</script>

<VipContentContainer>
  {#snippet header()}
    <VipHeader variant="hero">
      {#snippet icon()}
        <TraktIcon />
      {/snippet}

      Unlock <strong>more</strong> with Trakt VIP

      {#snippet description()}
        <span class="secondary">
          {m.text_vip_get_insights()}
        </span>
        <span class="secondary">
          VIP {m.text_vip_powers_trakt()}
        </span>
      {/snippet}
    </VipHeader>
  {/snippet}

  {#if dealPlan}
    <TwoYearDealCard plan={dealPlan} />
    <p class="trakt-vip-plans-divider small secondary uppercase">
      {m.text_vip_deal_or_standard_plan()}
    </p>
  {/if}

  <div id="vip-plans" class="trakt-vip-subscription-plans" class:has-deal={dealPlan != null}>
    {#each activePlans as plan (plan.type)}
      <SubscriptionCard {plan} />
    {/each}
  </div>
</VipContentContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-subscription-plans {
    --max-column-width: var(--ni-220);

    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, var(--max-column-width)));
    gap: var(--gap-xl);
    justify-content: center;

    padding: var(--ni-36) 0;
    margin-top: var(--ni-24);

    transition:
      gap,
      margin var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      gap: var(--gap-l);
    }

    @include for-mobile {
      margin-top: 0;
      grid-template-columns: var(--ni-280);
      gap: var(--gap-xl);
    }

    &.has-deal {
      margin-top: 0;
    }
  }

  .trakt-vip-plans-divider {
    width: 100%;
    max-width: var(--ni-768);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    margin-top: var(--ni-28);
    letter-spacing: 0.08em;

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: var(--ni-1);
      background: var(--color-border);
    }

    @include for-mobile {
      max-width: var(--ni-280);
      margin-top: var(--ni-16);
    }
  }
</style>
