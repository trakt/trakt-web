<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";

  const { actions }: { actions: Snippet } = $props();
</script>

<RenderFor audience="authenticated">
  <div class="trakt-card-action-bar">
    {@render actions()}
  </div>
</RenderFor>

<style>
  .trakt-card-action-bar {
    --height-action-bar: var(--ni-48);

    position: absolute;
    height: var(--height-action-bar);

    top: 0;
    right: 0;
    left: 0;
    z-index: var(--layer-floating);

    pointer-events: none;

    &::before {
      content: "";

      width: var(--height-action-bar);
      height: var(--height-action-bar);

      position: absolute;
      top: 0;
      right: 0;

      border-top-right-radius: var(--border-radius-m);

      background-image: radial-gradient(
        circle at top right,
        color-mix(in srgb, var(--color-shadow) 30%, transparent) 15%,
        transparent 65%
      );
    }

    :global(.trakt-popup-menu-button) {
      position: absolute;
      right: 0;
    }

    :global(> *) {
      pointer-events: auto;
    }
  }

  :global(.trakt-card):has(:global(.trakt-card-cover-image)) {
    :global(.trakt-card-action-bar)::before {
      opacity: 0;
      transition: opacity var(--transition-increment) ease-in-out;
    }

    &:has(:global(.image-loaded)) :global(.trakt-card-action-bar)::before {
      opacity: 1;
    }
  }
</style>
