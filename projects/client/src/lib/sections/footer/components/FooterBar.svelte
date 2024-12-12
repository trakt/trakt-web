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

    @media (max-width: 768px) {
      padding: var(--ni-12) var(--ni-16);
    }
  }
</style>
