<script lang="ts">
  const {
    isActive,
    disabled = false,
    children,
  }: { isActive: boolean; disabled?: boolean } & ChildrenProps = $props();
</script>

<div
  class="trakt-gesture-indicator"
  class:trakt-gesture-active={isActive && !disabled}
  class:is-disabled={disabled}
>
  {@render children()}
</div>

<style>
  .trakt-gesture-indicator {
    --color-gesture-inactive: color-mix(
      in srgb,
      var(--color-foreground) 35%,
      var(--color-background)
    );
    border-radius: var(--border-radius-m);

    width: calc(var(--indicator-width, 0) + calc(var(--border-radius-m) * 2));

    backdrop-filter: var(
      --filter-surface-blur,
      blur(var(--ni-8)) brightness(0.85)
    );
    background: var(--color-translucent-card-background-soft);
    color: var(--color-gesture-inactive);

    display: flex;
    align-items: center;
    justify-content: center;

    outline: var(--color-gesture-inactive) var(--ni-1) solid;
    outline-offset: var(--ni-neg-2);

    &.trakt-gesture-active {
      outline-color: var(--color-gesture-active);
      color: var(--color-gesture-active);
    }

    &.is-disabled {
      opacity: var(--opacity-disabled-control, 0.35);
    }

    :global(svg) {
      opacity: var(--swipe-progress, 0);
      transition: color var(--transition-increment) ease-in-out;
    }
  }
</style>
