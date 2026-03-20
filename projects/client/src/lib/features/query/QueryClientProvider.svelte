<script lang="ts">
  import { isPWA } from "$lib/utils/devices/isPWA";
  import { type QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { createPersister } from "./_internal/createPersister";

  const busterVersion = "v2";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  const persisterType = isPWA() ? "memory" : "idb";
</script>

<PersistQueryClientProvider
  {client}
  persistOptions={{
    persister: createPersister(persisterType),
    buster: busterVersion,
  }}
>
  {@render children()}
</PersistQueryClientProvider>
