<script lang="ts">
  import ApiApplicationEditor from "$lib/sections/settings/ApiApplicationEditor.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const appId = $derived(Number(params.id));
</script>

{#if Number.isFinite(appId)}
  <ApiApplicationEditor {appId} />
{/if}
