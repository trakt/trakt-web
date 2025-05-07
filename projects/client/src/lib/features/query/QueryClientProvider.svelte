<script lang="ts">
  import type { DeviceType } from "$lib/models/DeviceType";
  import { type QueryClient } from "@tanstack/svelte-query";
  import { PersistQueryClientProvider } from "@tanstack/svelte-query-persist-client";
  import { createPersister } from "./_internal/createPersister";

  const {
    children,
    client,
    device,
  }: ChildrenProps & { client: QueryClient; device?: DeviceType } = $props();
</script>

<PersistQueryClientProvider
  {client}
  persistOptions={{
    persister: createPersister(device),
  }}
>
  {@render children()}
</PersistQueryClientProvider>
