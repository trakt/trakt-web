<script lang="ts">
  import { onMount } from "svelte";
  import { useAutoSignin } from "./useAutoSignin";

  const { children }: ChildrenProps = $props();

  const { isAutoSignin, redirect } = $derived(useAutoSignin());

  onMount(() => {
    if (!isAutoSignin) {
      return;
    }

    redirect();
  });
</script>

{#if !isAutoSignin}
  {@render children()}
{/if}
