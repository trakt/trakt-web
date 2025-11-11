<script lang="ts">
  import { onMount } from "svelte";
  import { useRedirect } from "./useRedirect";

  const { children }: ChildrenProps = $props();

  const { isOgRedirect, redirect } = $derived(useRedirect());

  onMount(() => {
    if (!isOgRedirect) {
      return;
    }

    redirect();
  });
</script>

{#if !isOgRedirect}
  {@render children()}
{/if}
