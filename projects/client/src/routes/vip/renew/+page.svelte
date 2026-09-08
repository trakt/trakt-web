<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useVip } from "$lib/sections/vip/_internal/useVip";
  import { isPaypalGateway } from "$lib/sections/vip/_internal/utils/isPaypalGateway";
  import VipSubscribe from "$lib/sections/vip/VipSubscribe.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { subscription, isLoading } = useVip();

  // Re-signup mode: cancelled subscriptions renew here, and PayPal VIPs pick a
  // new plan here to switch to credit card (the API cancels PayPal after a
  // successful Stripe checkout). Active subscriptions on other gateways are
  // redirected so they can't double-subscribe.
  const canResubscribe = $derived(
    $subscription?.isCancelled || isPaypalGateway($subscription?.gateway),
  );
</script>

{#if $subscription && !canResubscribe}
  <Redirect to={UrlBuilder.vip()} />
{/if}

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title="VIP">
  <NavbarStateSetter mode="minimal" />

  {#if !$isLoading && canResubscribe}
    <VipSubscribe />
  {/if}
</TraktPage>
