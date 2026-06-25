<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import CreditCardIcon from "./icons/CreditCardIcon.svelte";
  import SubscriptionDetail from "./SubscriptionDetail.svelte";
  import { toPaymentMethodLabel } from "./utils/toPaymentMethodLabel";

  const { subscription }: { subscription: VipSubscription } = $props();

  const gatewayLabel = $derived(toPaymentMethodLabel(subscription.gateway));
</script>

<SubscriptionDetail title={m.header_payment_method()}>
  {#snippet icon()}
    <CreditCardIcon />
  {/snippet}

  {gatewayLabel}
</SubscriptionDetail>
