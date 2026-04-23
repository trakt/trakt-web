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
  <div class="trakt-confirmation-content">
    <p>{message}</p>
    {#if detail}
      <p>{detail}</p>
    {/if}
  </div>

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
  .trakt-confirmation-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
