<script lang="ts">
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import ManageLegacySubscription from "./ManageLegacySubscription.svelte";
  import SubscriptionManagement from "./SubscriptionManagement.svelte";
  import SubscriptionStatus from "./SubscriptionStatus.svelte";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();
</script>

<div class="trakt-vip-subscription-details">
  {#if !subscription || subscription.gateway !== "stripe"}
    <ManageLegacySubscription />
  {/if}

  {#if subscription?.gateway === "stripe"}
    <SubscriptionStatus {subscription} />
    <SubscriptionManagement {subscription} />
  {/if}
</div>

<style>
  .trakt-vip-subscription-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }
</style>
