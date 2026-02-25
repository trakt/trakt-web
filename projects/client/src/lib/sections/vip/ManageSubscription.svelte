<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import VipContent from "./_internal/VipContent.svelte";
  import VipHeader from "./_internal/VipHeader.svelte";
</script>

<VipContent>
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
</VipContent>
