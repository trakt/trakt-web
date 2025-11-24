<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { mobileAppleVisualViewportHack } from "./_internal/mobileAppleVisualViewportHack";
  import { useDialogState } from "./_internal/useDialogState.ts";

  type DialogProps = {
    title: string;
    dialog: Writable<HTMLDialogElement>;
    onClose?: () => void;
    badge?: Snippet;
    metaInfo?: string;
  } & ChildrenProps;

  const {
    title,
    children,
    onClose,
    dialog = writable(),
    badge,
    metaInfo,
  }: DialogProps = $props();

  const { isOpen, setDialogState } = useDialogState();
</script>

<dialog
  bind:this={$dialog}
  use:setDialogState
  use:mobileAppleVisualViewportHack
  onclose={() => onClose?.()}
>
  {#if $isOpen}
    <div class="trakt-dialog-header">
      <div class="trakt-dialog-title-container">
        <div class="trakt-dialog-title">
          <h5>{title}</h5>
          {#if metaInfo}
            <p class="title-meta-info bold ellipsis">{metaInfo}</p>
          {/if}
        </div>
        {@render badge?.()}
      </div>
      <ActionButton
        onclick={() => $dialog.close()}
        label={m.button_label_close()}
        style="ghost"
        --color-foreground-default="var(--color-text-secondary)"
      >
        <CloseIcon />
      </ActionButton>
    </div>

    <div class="trakt-dialog-content">
      {@render children()}
    </div>
  {/if}
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

    background: color-mix(in srgb, var(--color-background) 88%, transparent);
    opacity: 0;

    backdrop-filter: blur(var(--ni-8));
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

  .trakt-dialog-title-container {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-dialog-title {
    display: flex;
    flex-direction: column;

    .title-meta-info {
      color: var(--list-meta-info-color);
    }
  }

  .trakt-dialog-content {
    flex-grow: 1;
  }
</style>
