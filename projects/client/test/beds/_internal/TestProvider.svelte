<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<!-- TODO: add more providers here as we expand test suite -->
<QueryClientProvider client={new QueryClient()}>
  {@render children()}
</QueryClientProvider>
