<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";

  const {
    factory,
    output,
  }: {
    factory: () => unknown;
    output: (value: unknown) => void;
  } = $props();

  iffy(() => output(factory()));
</script>
