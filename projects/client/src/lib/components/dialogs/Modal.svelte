<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    onClose?: () => void;
    children: Snippet;
    footer?: Snippet;
  };

  const { onClose, children, footer }: Props = $props();

  // FIXME: merge with Dialog
</script>

<Dialog.Root
  open
  onOpenChange={(isOpen) => {
    if (!isOpen) onClose?.();
  }}
>
  <Dialog.Portal>
    <Dialog.Overlay class="trakt-modal-overlay" />
    <Dialog.Content class="trakt-modal" interactOutsideBehavior="close">
      <div class="trakt-modal-body">
        {@render children()}
      </div>
      {#if footer}
        <div class="trakt-modal-footer">
          {@render footer()}
        </div>
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-modal-overlay) {
    position: fixed;
    inset: 0;
    z-index: calc(var(--layer-top) - 1);
  }

  :global(.trakt-modal-overlay[data-state="open"]) {
    animation: blurIn var(--transition-increment) ease-in-out forwards;
  }

  @keyframes blurIn {
    from {
      backdrop-filter: blur(0);
    }
    to {
      backdrop-filter: blur(var(--ni-8));
    }
  }

  :global(.trakt-modal) {
    padding: var(--ni-24);
    border-radius: var(--border-radius-l);
    border: none;
    outline: none;
    background-color: var(--color-modal-background);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-dialog);

    max-width: var(--ni-480);
    min-width: var(--ni-320);

    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: var(--layer-top);

    @include for-mobile {
      --dialog-offset: var(--ni-24);
      --dialog-width: calc(100dvw - (2 * var(--dialog-offset)));

      box-sizing: border-box;
      width: var(--dialog-width);
      max-width: var(--dialog-width);
      min-width: 0;

      top: auto;
      bottom: calc(var(--dialog-offset) + env(safe-area-inset-bottom, 0));
      transform: translateX(-50%);
    }
  }

  :global(.trakt-modal-footer) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include for-mobile {
      flex-direction: column-reverse;
      align-items: stretch;
      gap: var(--ni-8);
    }
  }
</style>
