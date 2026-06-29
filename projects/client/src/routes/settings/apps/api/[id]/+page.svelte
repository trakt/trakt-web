<script lang="ts">
  import ApiApplicationDetail from "$lib/sections/settings/ApiApplicationDetail.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const appId = $derived(Number(params.id));
</script>

{#if Number.isFinite(appId)}
  <ApiApplicationDetail {appId} />
{/if}
