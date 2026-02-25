<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import UsageLimits from "./_internal/UsageLimits.svelte";
  import { useVip } from "./_internal/useVip";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";
  import VipHeader from "./_internal/VipHeader.svelte";

  const { limits, isLoadingLimits } = useVip();
</script>

<VipContent>
  {#if !$isLoadingLimits}
    <VipHeader>
      {#snippet icon()}
        <Preview />
      {/snippet}

      Sweet, you're a <VipBadge />

      {#snippet description()}
        <span>
          Soon you'll be able to manage your subscription settings here.
        </span>
      {/snippet}
    </VipHeader>

    {#if $limits}
      <UsageLimits limits={$limits} />
    {/if}

    <VipFeatures />
  {/if}
</VipContent>
