<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import type { QueryClient } from "@tanstack/query-core";
  import { setQueryClient } from "./_internal/queryClientContext";

  const { children, client }: ChildrenProps & { client: QueryClient } =
    $props();

  setQueryClient(iffy(() => client));
</script>

{@render children()}
