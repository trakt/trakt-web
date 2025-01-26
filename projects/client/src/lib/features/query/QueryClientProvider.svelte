<script lang="ts">
  import { type QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { createPersister } from "./createPersister";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();
</script>

<PersistQueryClientProvider
  {client}
  persistOptions={{
    persister: createPersister(),
  }}
>
  {@render children()}
</PersistQueryClientProvider>
