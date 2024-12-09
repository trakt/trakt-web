<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { initialize } from "./_internal/initialize";
  import { ANALYTICS_CONTEXT } from "./useAnalytics";

  const { children }: ChildrenProps = $props();
  const isInitialized = writable(false);

  onMount(() => {
    setContext(ANALYTICS_CONTEXT, initialize());
    isInitialized.set(true);
  });
</script>

{#if $isInitialized}
  {@render children()}
{/if}
