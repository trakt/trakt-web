<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import TraktIcon from "./icons/TraktIcon.svelte";
  import SubscriptionCard from "./SubscriptionCard.svelte";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipHeader from "./VipHeader.svelte";
</script>

<VipContentContainer>
  {#snippet header()}
    <VipHeader>
      {#snippet icon()}
        <TraktIcon />
      {/snippet}

      Unlock more with Trakt <VipBadge />

      {#snippet description()}
        <span class="secondary">
          {m.text_vip_get_insights()}
        </span>
      {/snippet}
    </VipHeader>
  {/snippet}

  <div class="trakt-vip-subscription-plans">
    {#each VIP_PLANS as plan (plan.type)}
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
    gap: var(--gap-l);
    justify-content: center;

    margin-top: var(--ni-24);

    transition:
      gap,
      margin var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      gap: var(--gap-m);
    }

    @include for-mobile {
      margin-top: 0;
      grid-template-columns: var(--ni-280);
      gap: var(--gap-l);
    }
  }
</style>
