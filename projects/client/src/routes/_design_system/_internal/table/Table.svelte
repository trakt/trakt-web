<script lang="ts">
  const { children, ...rest } = $props();
</script>

<table {...rest}>
  {@render children()}
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
</style>
