<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import AccountDetails from "./_internal/AccountDetails.svelte";
  import UsageLimits from "./_internal/UsageLimits.svelte";
  import { useVip } from "./_internal/useVip";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";

  const { subscription, isLoading } = useVip();
  const { limits } = useUser();
</script>

<VipContent>
  {#if $limits && !$isLoading}
    <AccountDetails subscription={$subscription} />

    <UsageLimits limits={$limits} />

    <VipFeatures />
  {/if}
</VipContent>
