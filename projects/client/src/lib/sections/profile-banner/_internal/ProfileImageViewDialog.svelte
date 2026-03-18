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
        label={m.button_text_cancel()}
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
    gap: var(--ni-16);
    padding: 0;
  }

  .view-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .view-image-wrapper {
    border-radius: var(--border-radius-m);
    overflow: hidden;
    aspect-ratio: 1;
    width: 100%;
    background-color: var(--shade-900);
  }

  .view-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
