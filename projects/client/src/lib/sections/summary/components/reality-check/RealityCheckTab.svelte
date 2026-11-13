<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { RealityCheckVariant } from "$lib/requests/models/RealityCheckVariant.ts";
  import { isDocumentaryCheck } from "$lib/utils/reality/isDocumentaryCheck.ts";
  import DocumentaryCheckTab from "./_internal/DocumentaryCheckTab.svelte";
  import RealityCheckDetail from "./_internal/RealityCheckDetail.svelte";
  import RealityCheckSkeleton from "./_internal/RealityCheckSkeleton.svelte";
  import RealityCheckSummary from "./_internal/RealityCheckSummary.svelte";
  import RealityCheckUpsell from "./_internal/RealityCheckUpsell.svelte";

  const { realityCheck }: { realityCheck: RealityCheckVariant | undefined } =
    $props();
</script>

{#if !realityCheck}
  <RealityCheckSkeleton />
{:else if isDocumentaryCheck(realityCheck)}
  <DocumentaryCheckTab documentaryCheck={realityCheck} />
{:else}
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
{/if}

<style>
  .trakt-reality-check-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
