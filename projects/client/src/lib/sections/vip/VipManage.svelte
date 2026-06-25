<script lang="ts">
  import AccountDetails from "./_internal/AccountDetails.svelte";
  import UsageTabs from "./_internal/UsageTabs.svelte";
  import { useVip } from "./_internal/useVip";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";

  const { subscription, isLoading } = useVip();
</script>

<VipContent>
  {#if !$isLoading}
    <div class="trakt-vip-account-group">
      <AccountDetails subscription={$subscription} />
    </div>

    <UsageTabs subscription={$subscription} />

    <VipFeatures />
  {/if}
</VipContent>

<style>
  .trakt-vip-account-group {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
