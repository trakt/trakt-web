<script lang="ts">
  import { derived, type Readable } from "svelte/store";
  import { QUERY_TEST_ID } from "./constants";

  const {
    queryFactory,
    mapper = (response) => response,
  }: {
    queryFactory: () => Readable<unknown>;
    mapper?: (response: unknown) => unknown;
  } = $props();

  const readable = derived(queryFactory(), mapper);
</script>

<pre data-testid={QUERY_TEST_ID}>{JSON.stringify($readable)}</pre>
