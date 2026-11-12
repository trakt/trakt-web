<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-month-review-tile-grid">
  {@render children()}
</div>

<style>
  .trakt-month-review-tile-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--gap-m);
    align-items: stretch;
  }
</style>
