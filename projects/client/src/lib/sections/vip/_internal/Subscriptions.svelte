<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import TraktIcon from "./icons/TraktIcon.svelte";
  import SubscriptionCard from "./SubscriptionCard.svelte";
  import { useVip } from "./useVip";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipHeader from "./VipHeader.svelte";

  const { plans, elevatedPlanType, setElevatedPlanType } = useVip();

  const activePlans = $derived($plans.length > 0 ? $plans : VIP_PLANS);

  const elevatedType = $derived($elevatedPlanType);
</script>

<VipContentContainer>
  {#snippet header()}
    <VipHeader variant="hero">
      {#snippet icon()}
        <TraktIcon />
      {/snippet}

      Unlock <strong>more</strong> with Trakt <VipBadge size="large" />

      {#snippet description()}
        <span class="secondary">
          {m.text_vip_get_insights()}
        </span>
        <span class="secondary">
          <VipBadge />
          {m.text_vip_powers_trakt()}
        </span>
      {/snippet}
    </VipHeader>
  {/snippet}

  <div class="trakt-vip-subscription-plans">
    {#each activePlans as plan (plan.type)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div onmouseenter={() => setElevatedPlanType(plan.type)}>
        <SubscriptionCard
          {plan}
          variant={elevatedType === plan.type ? "elevated" : "default"}
        />
      </div>
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
  }
</style>
