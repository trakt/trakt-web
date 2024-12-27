<script lang="ts">
  const {
    factory,
    output,
  }: {
    factory: () => unknown;
    output: (value: unknown) => void;
  } = $props();

  output(factory());
</script>
