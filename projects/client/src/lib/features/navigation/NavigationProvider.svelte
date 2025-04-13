<script lang="ts">
  import { onMount } from "svelte";
  import { useNavigation } from "./useNavigation";

  const { children }: ChildrenProps = $props();

  const { controller, redirect } = useNavigation();

  onMount(() => {
    if (!controller) {
      return;
    }

    redirect();
  });
</script>

{#if controller}
  <div use:controller>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
