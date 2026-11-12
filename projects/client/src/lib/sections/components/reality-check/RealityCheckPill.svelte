<script lang="ts">
  import type { RealityCheckVariant } from "$lib/requests/models/RealityCheckVariant.ts";
  import { isDocumentaryCheck } from "$lib/utils/reality/isDocumentaryCheck.ts";
  import DocumentaryTierPill from "./DocumentaryTierPill.svelte";
  import RealityTierPill from "./RealityTierPill.svelte";

  const { realityCheck }: { realityCheck: RealityCheckVariant } = $props();
</script>

{#if isDocumentaryCheck(realityCheck)}
  <DocumentaryTierPill tier={realityCheck.tier} />
{:else}
  <RealityTierPill tier={realityCheck.verdict} />
{/if}
