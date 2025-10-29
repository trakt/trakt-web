<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-summary-actions">
  {@render children()}
</div>

<style>
  .trakt-summary-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    position: relative;

    height: var(--ni-56);
    width: var(--ni-320);

    padding: var(--ni-8) var(--ni-10);
    box-sizing: border-box;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--popup-shadow);

    :global(.trakt-popup-menu-button) {
      color: var(--color-text-primary);
    }

    :global(svg) {
      height: var(--ni-16);
    }
  }
</style>
