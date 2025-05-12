<script lang="ts">
  const { isActive, children }: { isActive: boolean } & ChildrenProps =
    $props();
</script>

<div class="trakt-gesture-indicator" class:trakt-gesture-active={isActive}>
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

    backdrop-filter: blur(var(--ni-8)) brightness(0.85);
    color: var(--color-inactive-gesture);

    display: flex;
    align-items: center;
    justify-content: center;

    outline: var(--color-gesture-inactive) var(--ni-1) solid;
    outline-offset: var(--ni-neg-2);

    &.trakt-gesture-active {
      outline-color: var(--color-gesture-active);
      color: var(--color-gesture-active);
    }

    :global(svg) {
      opacity: var(--swipe-progress, 0);
      transition: color var(--transition-increment) ease-in-out;
    }
  }
</style>
