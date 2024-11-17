<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import type { CardFooterProps } from "$lib/components/card/CardFooterProps";

  const { actions, children }: CardFooterProps = $props();
</script>

<CardFooter>
  {@render children()}

  {#snippet actions()}
    {#if actions}
      {@render actions()}
    {/if}
  {/snippet}
</CardFooter>
