<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import Subscriptions from "./_internal/Subscriptions.svelte";
  import UpsellFooter from "./_internal/UpsellFooter.svelte";
  import UpsellLimits from "./_internal/UpsellLimits.svelte";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";

  const { limits } = useUser();
</script>

<VipContent>
  {#if $limits}
    <Subscriptions />

    <UpsellLimits limits={$limits} />

    <VipFeatures />
    <UpsellFooter />
  {/if}
</VipContent>
