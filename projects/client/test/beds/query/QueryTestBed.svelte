<script lang="ts">
  import type { Readable } from "svelte/store";
  import TestProvider from "../_internal/TestProvider.svelte";
  import QueryRunner from "./_internal/QueryRunner.svelte";

  const {
    queryFactory,
    mapper,
  }: {
    queryFactory: () => Readable<unknown>;
    mapper?: (response: any) => unknown;
  } = $props();
</script>

<TestProvider>
  <QueryRunner {queryFactory} {mapper} />
</TestProvider>
