<script lang="ts">
  import ConfirmationDialog from "$lib/components/dialogs/ConfirmationDialog.svelte";
  import { createConfirmationContext } from "./_internal/createConfirmationContext";

  const { children }: ChildrenProps = $props();

  const { activeConfirmation, hideConfirmation } = createConfirmationContext();
</script>

{@render children()}

{#if $activeConfirmation?.message}
  <ConfirmationDialog
    message={$activeConfirmation.message}
    buttonText={$activeConfirmation.buttonText}
    operation={$activeConfirmation.operation}
    onAction={(action) => {
      if (action === "confirm") {
        $activeConfirmation.onConfirm();
      }

      hideConfirmation();
    }}
  />
{/if}
