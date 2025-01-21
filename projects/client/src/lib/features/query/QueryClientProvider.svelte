<script lang="ts">
  import { time } from "$lib/utils/timing/time";
  import { type QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { onMount } from "svelte";
  import { idbPersisterFactory } from "./idbPersisterFactory";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  onMount(() => {
    setTimeout(() => {
      client.invalidateQueries();
    }, time.seconds(10));
  });
</script>

<PersistQueryClientProvider
  {client}
  persistOptions={{
    persister: idbPersisterFactory(),
    buster: TRAKT_QUERY_BUSTER,
  }}
>
  {@render children()}
</PersistQueryClientProvider>
