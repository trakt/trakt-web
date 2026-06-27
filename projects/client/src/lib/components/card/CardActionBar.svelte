<script lang="ts">
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";

  type CardActionBarProps = {
    actions: Snippet;
    variant?: "default" | "standalone";
  };

  const { isEditMode } = useEditMode();
  const { actions, variant = "default" }: CardActionBarProps = $props();
</script>

{#if !$isEditMode}
  <RenderFor audience="authenticated">
    <div class="trakt-card-action-bar" data-variant={variant}>
      {@render actions()}
    </div>
  </RenderFor>
{/if}

<style>
  .trakt-card-action-bar {
    --height-action-bar: var(--ni-48);

    position: absolute;
    height: var(--height-action-bar);

    top: 0;
    inset-inline-end: 0;
    inset-inline-start: 0;
    z-index: var(--layer-floating);

    pointer-events: none;

    &[data-variant="default"] {
      --action-bar-shadow-origin: top right;

      &:dir(rtl) {
        --action-bar-shadow-origin: top left;
      }

      &::before {
        content: "";

        width: var(--height-action-bar);
        height: var(--height-action-bar);

        position: absolute;
        top: 0;
        inset-inline-end: 0;

        border-start-end-radius: var(--border-radius-m);

        background-image: radial-gradient(
          circle at var(--action-bar-shadow-origin),
          color-mix(in srgb, var(--color-shadow) 30%, transparent) 15%,
          transparent 65%
        );
      }
    }

    :global(.trakt-popup-menu-button) {
      position: absolute;
      inset-inline-end: 0;
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
