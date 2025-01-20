<script lang="ts">
  import type { QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { idbPersisterFactory } from "./idbPersisterFactory";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();
</script>

<PersistQueryClientProvider
  {client}
  persistOptions={{ persister: idbPersisterFactory() }}
>
  {@render children()}
</PersistQueryClientProvider>
