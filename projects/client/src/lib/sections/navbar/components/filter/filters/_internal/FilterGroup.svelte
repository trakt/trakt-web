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
    gap: var(--gap-xxs);

    padding: var(--gap-xs);
    border-radius: var(--border-radius-m);

    border: var(--border-thickness-xxs) solid var(--color-filter-group-border);
  }
</style>
