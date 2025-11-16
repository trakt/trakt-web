<script lang="ts">
  import { initializeNavigation } from "./useNavigation";

  const { children }: ChildrenProps = $props();

  const { controller } = $derived(initializeNavigation());
</script>

{#if controller}
  <div use:controller>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
