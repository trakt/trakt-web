<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import * as m from "$lib/features/i18n/messages";
  import { Dialog } from "bits-ui";
  import { getSpotlightContext } from "./getSpotlightContext";
  import SpotlightPalette from "./SpotlightPalette.svelte";

  const { isOpen, close } = getSpotlightContext();

  afterNavigate(() => close());
</script>

<Dialog.Root
  open={$isOpen}
  onOpenChange={(open) => {
    if (!open) close();
  }}
>
  <Dialog.Portal>
    <Dialog.Overlay class="trakt-spotlight-overlay" />
    <Dialog.Content
      class="trakt-spotlight"
      interactOutsideBehavior="close"
      aria-label={m.spotlight_dialog_label()}
    >
      <Dialog.Title class="trakt-spotlight-title">
        {m.spotlight_dialog_label()}
      </Dialog.Title>

      <SpotlightPalette />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-spotlight-overlay) {
    position: fixed;
    inset: 0;
    z-index: calc(var(--layer-top) - 1);

    backdrop-filter: blur(var(--ni-8));
    background: color-mix(in srgb, var(--color-background) 45%, transparent);
    opacity: 0;
    will-change: opacity;
  }

  :global(.trakt-spotlight-overlay[data-state="open"]) {
    animation: spotlightOverlayIn var(--transition-increment) ease-in-out
      forwards;
  }

  @keyframes spotlightOverlayIn {
    to {
      opacity: 1;
    }
  }

  :global(.trakt-spotlight) {
    position: fixed;
    inset-inline: 0;
    inset-block-start: 15dvh;
    z-index: var(--layer-top);

    box-sizing: border-box;
    width: min(var(--ni-640), 92dvw);
    margin-inline: auto;

    display: flex;
    flex-direction: column;

    padding: var(--ni-8);
    border-radius: var(--border-radius-l);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    outline: none;
    background-color: var(--color-modal-background);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-dialog);

    transform-origin: top center;
  }

  :global(.trakt-spotlight[data-state="open"]) {
    animation: spotlightPanelIn var(--transition-increment) ease-out forwards;
  }

  @keyframes spotlightPanelIn {
    from {
      opacity: 0;
      transform: translateY(calc(-1 * var(--ni-8))) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  :global(.trakt-spotlight-title) {
    @include visually-hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.trakt-spotlight-overlay) {
      backdrop-filter: none;
    }

    :global(.trakt-spotlight) {
      animation: none;
    }
  }
</style>
