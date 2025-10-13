<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { ConfirmationAction } from "$lib/features/confirmation/models/ConfirmationAction";
  import type { ConfirmationOperation } from "$lib/features/confirmation/models/ConfirmationOperation";
  import * as m from "$lib/features/i18n/messages.ts";
  import { Modal } from "flowbite-svelte";
  import { CONFIRMATION_DIALOG_CLASS } from "./constants";

  const {
    message,
    buttonText,
    onAction,
    operation,
  }: {
    message: string;
    buttonText: string;
    operation: ConfirmationOperation;
    onAction: (action: ConfirmationAction) => void;
  } = $props();

  let isOpen = $state(true);
</script>

<Modal
  form
  bind:open={isOpen}
  permanent
  focustrap
  oncancel={() => onAction("cancel")}
  onaction={({ action }) => {
    if (action === "confirm") {
      onAction("confirm");
      return;
    }

    onAction("cancel");
  }}
  class={CONFIRMATION_DIALOG_CLASS}
  classes={{
    header: "trakt-confirmation-dialog-header",
    body: "trakt-confirmation-dialog-body",
    footer: "trakt-confirmation-dialog-footer",
  }}
>
  <p>{message}</p>

  {#snippet footer()}
    <Button
      size="small"
      value="cancel"
      color="default"
      label={m.button_text_cancel()}
    >
      {m.button_text_cancel()}
    </Button>
    <Button
      type="submit"
      size="small"
      value="confirm"
      variant={operation === "destructive" ? "secondary" : "primary"}
      color={operation === "destructive" ? "red" : "purple"}
      label={buttonText}
    >
      {buttonText}
    </Button>
  {/snippet}
</Modal>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-confirmation-dialog) {
    padding: var(--ni-24);
    border-radius: var(--border-radius-l);
    border: none;
    background-color: var(--color-card-background);
    color: var(--color-text-primary);
    max-width: var(--ni-380);

    box-shadow: var(--popup-shadow);

    :global(form) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-24);
    }

    @include for-mobile {
      --dialog-offset: var(--ni-24);
      --dialog-width: calc(100dvw - (2 * var(--dialog-offset)));

      box-sizing: border-box;

      width: var(--dialog-width);
      max-width: var(--dialog-width);

      margin: 0 auto;

      top: auto;
      bottom: calc(var(--dialog-offset) + env(safe-area-inset-bottom, 0));
    }
  }

  :global(.trakt-confirmation-dialog[open]) {
    @keyframes blurIn {
      from {
        backdrop-filter: blur(0);
      }
      to {
        backdrop-filter: blur(var(--ni-8));
      }
    }

    &::backdrop {
      animation: blurIn var(--transition-increment) ease-in-out forwards;
    }
  }

  :global(.trakt-confirmation-dialog-header) {
    display: none;
  }

  :global(.trakt-confirmation-dialog-footer) {
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
