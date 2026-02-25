<script lang="ts">
  import { VIP_PLANS } from "./constants";
  import SubscriptionCard from "./SubscriptionCard.svelte";
</script>

<div class="trakt-vip-subscription-plans">
  {#each VIP_PLANS as plan (plan.type)}
    <SubscriptionCard {plan} />
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-subscription-plans {
    --max-column-width: var(--ni-220);

    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, var(--max-column-width)));
    gap: var(--gap-l);
    justify-content: center;

    transition: gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      gap: var(--gap-m);
    }

    @include for-mobile {
      grid-template-columns: 75dvw;
      gap: var(--gap-l);
    }
  }
</style>
