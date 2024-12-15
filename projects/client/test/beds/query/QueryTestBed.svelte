<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { Readable } from "svelte/store";
  import QueryRunner from "./_internal/QueryRunner.svelte";

  const {
    queryFactory,
    mapper,
  }: {
    queryFactory: () => Readable<unknown>;
    mapper?: (response: any) => unknown;
  } = $props();
</script>

<QueryClientProvider client={new QueryClient()}>
  <QueryRunner {queryFactory} {mapper} />
</QueryClientProvider>
