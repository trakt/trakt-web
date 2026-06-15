<script lang="ts">
  import type { QueryClient } from "@tanstack/query-core";
  import { setQueryClient } from "./_internal/queryClientContext";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  setQueryClient(client);
</script>

{@render children()}
