<script lang="ts">
  import { derived, type Readable } from "svelte/store";

  const {
    factory,
    output,
    mapper = (response) => response,
    waitFor = (response) => !!response,
  }: {
    factory: () => Readable<unknown>;
    output: (value: unknown) => void;
    mapper?: (response: unknown) => unknown;
    waitFor?: (response: unknown) => boolean;
  } = $props();

  const readable = derived(factory(), mapper);

  readable.subscribe((result) => {
    if (!waitFor(result)) {
      return;
    }

    output(result);
  });
</script>
