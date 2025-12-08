<script lang="ts">
  import { type QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { createPersister } from "./_internal/createPersister";

  const BUSTER_VERSION = "v1";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();
</script>

<PersistQueryClientProvider
  {client}
  persistOptions={{
    persister: createPersister(),
    buster: BUSTER_VERSION,
  }}
>
  {@render children()}
</PersistQueryClientProvider>
