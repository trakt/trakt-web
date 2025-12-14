<script lang="ts">
  import type { Observable } from "rxjs";
  import TestProvider from "../_internal/TestProvider.svelte";
  import QueryRunner from "./_internal/QueryRunner.svelte";

  const {
    factory,
    output,
    mapper,
    waitFor,
  }: {
    factory: () => Observable<unknown>;
    output: (value: unknown) => void;
    mapper?: (response: any) => unknown;
    waitFor?: (response: any) => boolean;
  } = $props();
</script>

<TestProvider>
  <QueryRunner {factory} {output} {mapper} {waitFor} />
</TestProvider>
