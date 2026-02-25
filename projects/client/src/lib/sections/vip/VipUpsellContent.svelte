<script lang="ts">
  import Subscriptions from "./_internal/Subscriptions.svelte";
  import UpsellFooter from "./_internal/UpsellFooter.svelte";
  import UpsellLimits from "./_internal/UpsellLimits.svelte";
  import { useVip } from "./_internal/useVip";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";

  const { limits, isLoadingLimits } = useVip();
</script>

<VipContent>
  {#if !$isLoadingLimits}
    <Subscriptions />

    {#if $limits}
      <UpsellLimits limits={$limits} />
    {/if}

    <VipFeatures />
    <UpsellFooter />
  {/if}
</VipContent>
