<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-drawer-dock">
  {@render children()}
</div>

<style lang="scss">
  .trakt-drawer-dock {
    --drawer-dock-padding: var(--gap-xs);
    --drawer-dock-surface: color-mix(
      in srgb,
      var(--color-dialog-background) 86%,
      transparent
    );

    position: sticky;
    bottom: var(--gap-xxs);
    z-index: var(--layer-raised);

    display: flex;
    gap: var(--gap-xs);

    margin-block-start: auto;
    padding: var(--drawer-dock-padding);

    border: var(--border-thickness-xxs) solid var(--color-drawer-border);
    border-radius: calc(
      var(--border-radius-m) * 0.8 + var(--drawer-dock-padding)
    );

    background: var(--drawer-dock-surface);
    backdrop-filter: blur(var(--ni-12));
    box-shadow: var(--shadow-dialog);

    :global(.trakt-button) {
      flex: 1;
    }
  }
</style>
