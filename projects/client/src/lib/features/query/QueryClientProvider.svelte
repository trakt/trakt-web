<script lang="ts">
  import { isPWA } from "$lib/utils/devices/isPWA";
  import type { QueryClient } from "@tanstack/query-core";
  import {
    persistQueryClientRestore,
    persistQueryClientSubscribe,
  } from "@tanstack/query-persist-client-core";
  import { createPersister } from "./_internal/createPersister";
  import { setQueryClient } from "./_internal/queryClientContext";

  const busterVersion = "v2";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  setQueryClient(client);

  // Component <script> blocks run once per instance, so the plain object
  // literal already gives us a stable persistOptions reference. Recomputing
  // it on every render is a React idiom and doesn't apply here.
  const persistOptions = {
    queryClient: client,
    persister: createPersister(isPWA() ? "memory" : "idb"),
    buster: busterVersion,
  };

  // `$effect` instead of `onMount` so that if `client` ever changes
  // (e.g. on a SvelteKit client-side navigation that re-runs the layout
  // load), the cleanup tears down the old persist subscription before the
  // new one is wired up.
  $effect(() => {
    persistQueryClientRestore(persistOptions);
    return persistQueryClientSubscribe(persistOptions);
  });
</script>

{@render children()}
