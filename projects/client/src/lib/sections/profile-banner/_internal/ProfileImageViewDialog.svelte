<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    src,
    alt,
    onClose,
  }: {
    src: string;
    alt: string;
    onClose: () => void;
  } = $props();
</script>

<Modal {onClose}>
  <div class="view-dialog">
    <div class="view-header">
      <ActionButton
        label={m.button_label_close()}
        color="default"
        style="ghost"
        onclick={onClose}
      >
        <CloseIcon />
      </ActionButton>
    </div>
    <div class="view-image-wrapper">
      <img {src} {alt} class="view-image" />
    </div>
  </div>
</Modal>

<style>
  .view-dialog {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .view-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-block-start: calc(-1 * var(--gap-xs));
    margin-inline-end: calc(-1 * var(--gap-xs));
  }

  .view-image-wrapper {
    border-radius: var(--border-radius-l);
    overflow: hidden;
    aspect-ratio: 1;
    width: 100%;
    background-color: var(--color-dialog-inset);
  }

  .view-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
