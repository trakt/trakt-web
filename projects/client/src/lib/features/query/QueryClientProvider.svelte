<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import type { QueryClient } from "@tanstack/query-core";
  import { onMount } from "svelte";
  import { setQueryClient } from "./_internal/queryClientContext";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  setQueryClient(iffy(() => client));

  // `mount` is what subscribes the client to the focus and online managers.
  // Without it `refetchOnWindowFocus` never fires and paused mutations never
  // resume - query-core leaves that wiring to the framework adapter.
  onMount(() => {
    client.mount();

    return () => client.unmount();
  });
</script>

{@render children()}
