<script lang="ts">
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import type { ConfirmationOperation } from "$lib/features/confirmation/models/ConfirmationOperation";

  const {
    message,
    buttonText,
    operation,
    onCancel,
    onConfirm,
  }: {
    message: string;
    buttonText: string;
    operation: ConfirmationOperation;
    onConfirm: () => void;
    onCancel: () => void;
  } = $props();
</script>

<Modal
  {onCancel}
  {onConfirm}
  confirmButton={{
    text: buttonText,
    label: buttonText,
    variant: operation === "destructive" ? "secondary" : "primary",
    color: operation === "destructive" ? "red" : "purple",
  }}
>
  <p>{message}</p>
</Modal>
