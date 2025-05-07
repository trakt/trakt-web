<script lang="ts">
  const { header = false, children, ...rest } = $props();
</script>

{#if header}
  <th {...rest}>
    {@render children()}
  </th>
{:else}
  <td {...rest}>
    {@render children()}
  </td>
{/if}

<style>
  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border: 1px solid var(--color-border);
  }

  th {
    background-color: var(--color-background);
    font-weight: 600;
  }
</style>
