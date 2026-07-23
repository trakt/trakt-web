<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-vip-feature-icon">{@render children()}</div>

<style>
  .trakt-vip-feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-36);
    height: var(--ni-36);

    background: color-mix(in srgb, var(--purple-500) 15%, transparent);

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-400) 30%, transparent);
    box-shadow: var(
      --shadow-decorative-surface,
      0 var(--ni-2) var(--ni-12)
        color-mix(in srgb, var(--purple-500) 15%, transparent)
    );

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  :global(:root[data-reduced-visual-noise]) .trakt-vip-feature-icon {
    border-color: var(--color-flat-surface-border);
    box-shadow: none;
  }
</style>
