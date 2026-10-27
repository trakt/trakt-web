<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    onClose?: () => void;
    children: Snippet;
    footer?: Snippet;
  };

  const { onClose, children, footer }: Props = $props();

  let content = $state<HTMLElement | null>(null);

  // Bits UI focuses the first tabbable element on open; a child marked
  // data-autofocus takes that focus instead, e.g. the safe action of a
  // preventative confirmation that sits after the risky one.
  const focusPreferred = (event: Event) => {
    const preferred = content?.querySelector<HTMLElement>("[data-autofocus]");
    if (!preferred) return;

    event.preventDefault();
    preferred.focus({ preventScroll: true });
  };

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
    <Dialog.Content
      bind:ref={content}
      class="trakt-modal"
      interactOutsideBehavior="close"
      onOpenAutoFocus={focusPreferred}
    >
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

    backdrop-filter: blur(var(--ni-8));
    opacity: 0;
  }

  :global(.trakt-modal-overlay[data-state="open"]) {
    animation: modal-fade-in var(--transition-increment) ease-in-out forwards;
  }

  :global(.trakt-modal) {
    --modal-inset: var(--gap-m);

    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: var(--layer-top);

    box-sizing: border-box;
    width: min(var(--ni-480), calc(100dvw - 2 * var(--modal-inset)));
    padding: var(--gap-l);

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    border-radius: var(--border-radius-xxl);
    outline: none;
    background-color: var(--color-modal-background);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-dialog);

    @include for-mobile {
      top: auto;
      bottom: calc(var(--modal-inset) + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%);

      width: calc(100dvw - 2 * var(--modal-inset));
    }
  }

  :global(.trakt-modal)::before {
    content: "";

    position: absolute;
    inset: 0;

    padding: var(--border-thickness-xxs);
    border-radius: inherit;
    background: var(--background-dialog-edge);
    mask:
      linear-gradient(black 0 0) content-box,
      linear-gradient(black 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  :global(.trakt-modal[data-state="open"]) {
    animation: modal-card-in calc(var(--transition-increment) * 1.5) ease-out;
  }

  :global(.trakt-modal-footer) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-s);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.trakt-modal-overlay) {
      backdrop-filter: none;
      background: color-mix(in srgb, var(--color-background) 60%, transparent);
    }

    :global(.trakt-modal[data-state="open"]) {
      animation-name: modal-fade-in;
    }
  }

  @keyframes modal-card-in {
    from {
      opacity: 0;
      translate: 0 var(--ni-8);
    }
  }

  @keyframes modal-fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
