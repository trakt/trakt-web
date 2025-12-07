<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
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

  iffy(() =>
    derived(factory(), mapper).subscribe((result) => {
      if (!waitFor(result)) {
        return;
      }

      output(result);
    }),
  );
</script>
