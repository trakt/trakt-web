<script lang="ts">
  const { children, ...rest } = $props();
</script>

<tbody {...rest}>
  {@render children()}
</tbody>
