<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-summary-side-actions">
  {@render children()}
</div>

<style>
  .trakt-summary-side-actions {
    display: flex;
    flex-direction: column;

    justify-content: flex-start;
    align-items: flex-start;

    gap: var(--gap-s);

    :global(.trakt-action-button) {
      background: transparent;
      backdrop-filter: none;

      :global(svg) {
        color: var(--color-foreground);
      }
    }
  }
</style>
