<script lang="ts">
  import ConfirmationDialog from "./_internal/ConfirmationDialog.svelte";
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
    onConfirm={() => $activeConfirmation.onConfirm()}
    onCancel={() => hideConfirmation()}
  />
{/if}
