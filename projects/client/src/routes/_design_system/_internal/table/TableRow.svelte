<script lang="ts">
  const { highlight = false, children, ...rest } = $props();
</script>

<tr class:trakt-row-highlighted={highlight} {...rest}>
  {@render children()}
</tr>

<style>
  tr:nth-child(even) {
    background-color: color-mix(
      in srgb,
      var(--color-background) 97.5%,
      var(--color-foreground)
    );
  }

  tr:nth-child(odd) {
    background-color: color-mix(
      in srgb,
      var(--color-background) 95%,
      var(--color-foreground)
    );
  }

  tr.trakt-row-highlighted {
    font-weight: bold;
    border-top: 2px solid var(--blue-600);
    border-bottom: 2px solid var(--blue-600);
    background-color: color-mix(
      in srgb,
      var(--color-background) 95%,
      var(--blue-600)
    );
  }
</style>
