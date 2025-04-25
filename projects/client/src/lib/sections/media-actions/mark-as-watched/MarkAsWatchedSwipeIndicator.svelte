<script lang="ts">
  import MarkAsWatchedIcon from "$lib/components/icons/MarkAsWatchedIcon.svelte";

  const { isActive }: { isActive: boolean } = $props();
</script>

<div class="trakt-gesture-indicator" class:trakt-gesture-active={isActive}>
  <MarkAsWatchedIcon size="normal" state="unwatched" />
</div>

<style>
  .trakt-gesture-indicator {
    border-radius: var(--border-radius-m);

    width: calc(var(--indicator-width, 0) + calc(var(--border-radius-m) * 2));

    backdrop-filter: blur(var(--ni-8)) brightness(0.85);
    color: var(--color-foreground);

    display: flex;
    align-items: center;
    justify-content: center;

    outline: var(--color-foreground) var(--ni-1) solid;
    outline-offset: var(--ni-neg-2);

    &.trakt-gesture-active {
      outline-color: var(--color-background-purple);
      color: var(--color-background-purple);
    }

    :global(svg) {
      opacity: var(--swipe-progress, 0);
      transition: color var(--transition-increment) ease-in-out;
    }
  }
</style>
