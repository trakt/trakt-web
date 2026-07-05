<script lang="ts">
  import ConfirmationDialog from "$lib/components/dialogs/ConfirmationDialog.svelte";
  import { createConfirmationContext } from "./_internal/createConfirmationContext";

  const { children }: ChildrenProps = $props();

  const { activeConfirmation, hideConfirmation } = createConfirmationContext();
</script>

{@render children()}

{#if $activeConfirmation?.message}
  <ConfirmationDialog
    title={$activeConfirmation.title}
    message={$activeConfirmation.message}
    detail={$activeConfirmation.detail}
    buttonText={$activeConfirmation.buttonText}
    cancelText={$activeConfirmation.cancelText}
    operation={$activeConfirmation.operation}
    challenge={$activeConfirmation.challenge}
    onAction={(action) => {
      if (action === "confirm") {
        $activeConfirmation.onConfirm();
      }

      if (action === "cancel") {
        $activeConfirmation.onCancel?.();
      }

      hideConfirmation();
    }}
  />
{/if}
