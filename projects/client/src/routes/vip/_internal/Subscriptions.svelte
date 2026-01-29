<script lang="ts">
  import { VIP_PLANS } from "./constants";
  import SubscriptionCard from "./SubscriptionCard.svelte";
</script>

<div class="trakt-vip-subscription-plans">
  {#each VIP_PLANS as plan (plan.type)}
    <SubscriptionCard {plan} />
  {/each}
</div>

<style>
  .trakt-vip-subscription-plans {
    display: flex;
    gap: var(--ni-24);
    justify-content: center;
  }
</style>
