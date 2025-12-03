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

    width: var(--summary-side-action-bar-width);

    :global(.trakt-action-button) {
      :global(svg) {
        color: var(--color-foreground);
      }
    }
  }
</style>
