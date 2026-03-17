<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useVip } from "$lib/sections/vip/_internal/useVip";
  import VipSubscribe from "$lib/sections/vip/VipSubscribe.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { subscription, isLoading } = useVip();
</script>

{#if $subscription && !$subscription.isCancelled}
  <Redirect to={UrlBuilder.vip()} />
{/if}

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title="VIP">
  <NavbarStateSetter mode="minimal" />

  {#if !$isLoading && $subscription?.isCancelled}
    <VipSubscribe />
  {/if}
</TraktPage>
