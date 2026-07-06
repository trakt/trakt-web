<script lang="ts">
  import StreamingServicesDetail from "$lib/sections/settings/StreamingServicesDetail.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const syncId = $derived(Number(params.id));
</script>

{#if Number.isFinite(syncId)}
  <StreamingServicesDetail {syncId} />
{/if}
