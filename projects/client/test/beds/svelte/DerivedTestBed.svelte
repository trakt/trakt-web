<script lang="ts">
  const { compute }: { compute: () => unknown } = $props();

  const value = $derived.by(compute);
</script>

{String(value)}
