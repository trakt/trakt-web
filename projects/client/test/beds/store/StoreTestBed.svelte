<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
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
<QueryClientProvider client={new QueryClient()}>
  <StoreRunner {factory} {output} />
</QueryClientProvider>
