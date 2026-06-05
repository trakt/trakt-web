<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import StreamingSyncDetail from "$lib/sections/settings/StreamingSyncDetail.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const syncId = $derived(Number(params.id));
</script>

<RenderForFeature flag={FeatureFlag.StreamingSync}>
  {#snippet enabled()}
    {#if Number.isFinite(syncId)}
      <StreamingSyncDetail {syncId} />
    {/if}
  {/snippet}
</RenderForFeature>
