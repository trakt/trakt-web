<script>
  import ConfirmationProvider from "$lib/features/confirmation/ConfirmationProvider.svelte";
  import FilterProvider from "$lib/features/filters/FilterProvider.svelte";
  import TestProvider from "../_internal/TestProvider.svelte";

  const input = $props();
</script>

{#snippet subject()}
  <input.component {...input.props} />
{/snippet}

<TestProvider>
  <ConfirmationProvider>
    {#if input.withFilters}
      <FilterProvider>{@render subject()}</FilterProvider>
    {:else}
      {@render subject()}
    {/if}
  </ConfirmationProvider>
</TestProvider>
