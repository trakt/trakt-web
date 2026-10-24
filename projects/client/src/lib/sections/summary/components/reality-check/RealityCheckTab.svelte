<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import RealityCheckDetail from "./_internal/RealityCheckDetail.svelte";
  import RealityCheckSkeleton from "./_internal/RealityCheckSkeleton.svelte";
  import RealityCheckSummary from "./_internal/RealityCheckSummary.svelte";
  import RealityCheckUpsell from "./_internal/RealityCheckUpsell.svelte";

  const { realityCheck }: { realityCheck: RealityCheck | undefined } = $props();
</script>

{#if realityCheck}
  <div class="trakt-reality-check-tab">
    <RealityCheckSummary {realityCheck} />

    <RenderFor audience="vip">
      {#if realityCheck.detail}
        <RealityCheckDetail detail={realityCheck.detail} />
      {/if}
    </RenderFor>

    <RenderFor audience="free">
      <RealityCheckUpsell />
    </RenderFor>
  </div>
{:else}
  <RealityCheckSkeleton />
{/if}

<style>
  .trakt-reality-check-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
