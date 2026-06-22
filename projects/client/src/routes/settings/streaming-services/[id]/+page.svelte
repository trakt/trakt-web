<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import StreamingServicesDetail from "$lib/sections/settings/StreamingServicesDetail.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const syncId = $derived(Number(params.id));
</script>

<RenderForFeature flag={FeatureFlag.StreamingServices}>
  {#snippet enabled()}
    {#if Number.isFinite(syncId)}
      <StreamingServicesDetail {syncId} />
    {/if}
  {/snippet}
</RenderForFeature>
