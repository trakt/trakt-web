<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { ConfirmationAction } from "$lib/features/confirmation/models/ConfirmationAction";
  import type { ConfirmationOperation } from "$lib/features/confirmation/models/ConfirmationOperation";
  import * as m from "$lib/features/i18n/messages.ts";
  import Modal from "./Modal.svelte";

  const {
    message,
    detail,
    buttonText,
    onAction,
    operation,
  }: {
    message: string;
    detail?: string;
    buttonText: string;
    operation: ConfirmationOperation;
    onAction: (action: ConfirmationAction) => void;
  } = $props();
</script>

<Modal onClose={() => onAction("cancel")}>
  <p>{message}</p>
  {#if detail}
    <p class="trakt-confirmation-detail">{detail}</p>
  {/if}

  {#snippet footer()}
    <Button
      size="small"
      color="default"
      label={m.button_text_cancel()}
      onclick={() => onAction("cancel")}
    >
      {m.button_text_cancel()}
    </Button>
    <Button
      size="small"
      variant={operation === "destructive" ? "secondary" : "primary"}
      color={operation === "destructive" ? "red" : "purple"}
      label={buttonText}
      onclick={() => onAction("confirm")}
    >
      {buttonText}
    </Button>
  {/snippet}
</Modal>

<style>
  .trakt-confirmation-detail {
    margin-top: var(--gap-m);
  }
</style>
