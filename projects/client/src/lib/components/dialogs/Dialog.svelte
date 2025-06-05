<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable, type Writable } from "svelte/store";
  import { mobileAppleVisualViewportHack } from "./_internal/mobileAppleVisualViewportHack";
  import { setDialogState } from "./_internal/setDialogState";

  type DialogProps = {
    title: string;
    dialog: Writable<HTMLDialogElement>;
    onClose?: () => void;
  } & ChildrenProps;

  const {
    title,
    children,
    onClose,
    dialog = writable(),
  }: DialogProps = $props();
</script>

<dialog
  bind:this={$dialog}
  use:setDialogState
  use:mobileAppleVisualViewportHack
  onclose={() => onClose?.()}
>
  <div class="trakt-dialog-header">
    <h5 class="secondary">{title}</h5>
    <ActionButton
      onclick={() => $dialog.close()}
      label={m.close_label()}
      style="ghost"
      --color-foreground-default="var(--color-text-secondary)"
    >
      <CloseIcon />
    </ActionButton>
  </div>

  <div class="trakt-dialog-content">
    {@render children()}
  </div>
</dialog>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  dialog {
    all: unset;

    --transition-duration: calc(var(--transition-increment) * 2);
    border: none;
    outline: none;

    display: none;
    flex-direction: column;
    overflow: hidden;

    position: fixed;
    top: 0;
    left: 0;

    width: 100dvw;
    height: var(--dialog-height);

    max-width: 100dvw;
    max-height: var(--dialog-height);

    background: color-mix(
      in srgb,
      var(--color-background) 88%,
      transparent 12%
    );
    opacity: 0;

    @include backdrop-filter-blur(var(--ni-8));
  }

  @keyframes dialogOpen {
    from {
      opacity: 0;
      transform: scaleY(0);
    }
    to {
      opacity: 1;
      transform: scaleY(1);
    }
  }

  dialog[open] {
    display: flex;

    animation: dialogOpen var(--transition-duration) ease-in-out;
    opacity: 1;
    transform: scaleY(1);
  }

  .trakt-dialog-header {
    height: var(--ni-72);

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: calc(100dvw - 2 * var(--layout-distance-side));
    box-sizing: border-box;

    margin: var(--ni-12) var(--layout-distance-side);
    margin-top: calc(var(--ni-12) + env(safe-area-inset-top));
    padding: 0 var(--navbar-side-padding);
  }

  .trakt-dialog-content {
    flex-grow: 1;
  }
</style>
