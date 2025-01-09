<script lang="ts">
  import type { Readable } from "svelte/store";
  import TestProvider from "../_internal/TestProvider.svelte";
  import QueryRunner from "./_internal/QueryRunner.svelte";

  const {
    factory,
    output,
    mapper,
  }: {
    factory: () => Readable<unknown>;
    output: (value: unknown) => void;
    mapper?: (response: any) => unknown;
  } = $props();
</script>

<TestProvider>
  <QueryRunner {factory} {output} {mapper} />
</TestProvider>
