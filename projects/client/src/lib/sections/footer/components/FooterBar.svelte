<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-footer-bar">
  {@render children?.()}
</div>

<style>
  .trakt-footer-bar {
    padding: var(--ni-40);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
