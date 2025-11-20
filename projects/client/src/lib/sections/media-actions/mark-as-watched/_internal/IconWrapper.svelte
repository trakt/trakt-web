<script lang="ts">
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";

  const { children, isLoading }: { isLoading: boolean } & ChildrenProps =
    $props();
</script>

{#if isLoading}
  <LoadingIndicator />
{:else}
  {@render children()}
{/if}
