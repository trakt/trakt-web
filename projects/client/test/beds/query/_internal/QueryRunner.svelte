<script lang="ts">
  import { derived, type Readable } from "svelte/store";

  const {
    factory,
    output,
    mapper = (response) => response,
  }: {
    factory: () => Readable<unknown>;
    output: (value: unknown) => void;
    mapper?: (response: unknown) => unknown;
  } = $props();

  const readable = derived(factory(), mapper);

  readable.subscribe((result) => {
    if (!result) {
      return;
    }

    output(result);
  });
</script>
