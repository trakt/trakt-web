<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-filter-group">
  {@render children()}
</div>

<style>
  .trakt-filter-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-s);
  }
</style>
