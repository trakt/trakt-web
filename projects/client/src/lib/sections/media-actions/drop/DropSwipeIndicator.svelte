<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";

  const { isActive }: { isActive: boolean } = $props();
</script>

<div class="trakt-gesture-indicator" class:trakt-gesture-active={isActive}>
  <DropIcon />
</div>

<style>
  .trakt-gesture-indicator {
    --color-inactive-gesture: color-mix(
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

    outline: var(--color-inactive-gesture) var(--ni-1) solid;
    outline-offset: var(--ni-neg-2);

    &.trakt-gesture-active {
      outline-color: var(--color-foreground);
      color: var(--color-foreground);
    }

    :global(svg) {
      opacity: var(--swipe-progress, 0);
      transition: color var(--transition-increment) ease-in-out;
    }
  }
</style>
