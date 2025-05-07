<script lang="ts">
  const { children, ...rest } = $props();
</script>

<thead {...rest}>
  {@render children()}
</thead>
