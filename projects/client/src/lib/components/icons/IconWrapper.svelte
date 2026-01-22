<script lang="ts">
  import LoadingIndicator from "./LoadingIndicator.svelte";

  const { children, isLoading }: { isLoading: boolean } & ChildrenProps =
    $props();
</script>

{#if isLoading}
  <LoadingIndicator />
{:else}
  {@render children()}
{/if}
