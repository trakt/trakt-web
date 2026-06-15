<script lang="ts">
  import { isPWA } from "$lib/utils/devices/isPWA";
  import { type QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { createPersister } from "./_internal/createPersister";

  const busterVersion = "v2";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  // Stable reference - re-creating the literal inline retriggers
  // PersistQueryClientProvider's restore effect, which thrashes `isRestoring`
  // and tears down every active QueryObserver via createBaseQuery's
  // subscribe-effect cleanup.
  const persistOptions = iffy(() => ({
    persister: createPersister(isPWA() ? "memory" : "idb"),
    buster: busterVersion,
  }));
</script>

<PersistQueryClientProvider {client} {persistOptions}>
  {@render children()}
</PersistQueryClientProvider>
