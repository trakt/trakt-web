<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-filter-group">
  {@render children()}
</div>

<style lang="scss">
  .trakt-filter-group {
    display: flex;
    flex-direction: column;

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid
        var(--color-filter-row-border);
    }
  }
</style>
