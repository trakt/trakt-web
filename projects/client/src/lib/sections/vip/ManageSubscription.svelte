<script lang="ts">
  import AccountDetails from "./_internal/AccountDetails.svelte";
  import UsageLimits from "./_internal/UsageLimits.svelte";
  import { useVip } from "./_internal/useVip";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";

  const { limits, isLoadingLimits } = useVip();
</script>

<VipContent>
  {#if !$isLoadingLimits}
    <AccountDetails />

    {#if $limits}
      <UsageLimits limits={$limits} />
    {/if}

    <VipFeatures />
  {/if}
</VipContent>
