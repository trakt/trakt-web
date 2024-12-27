<script lang="ts">
  import TestProvider from "../_internal/TestProvider.svelte";
  import StoreRunner from "./_internal/StoreRunner.svelte";

  const {
    factory,
    output,
  }: {
    factory: () => unknown;
    output: (value: unknown) => void;
  } = $props();
</script>

<!-- TODO: add more providers here as we expand test suite -->
<TestProvider>
  <StoreRunner {factory} {output} />
</TestProvider>
