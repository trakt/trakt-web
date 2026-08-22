<script lang="ts">
  import ConfirmationDialog from "$lib/components/dialogs/ConfirmationDialog.svelte";
  import { confirmationContent } from "./_internal/confirmationContent.ts";
  import { createConfirmationContext } from "./_internal/createConfirmationContext";

  const { children }: ChildrenProps = $props();

  const { activeConfirmation, hideConfirmation } = createConfirmationContext();

  const ContentComponent = $derived(
    $activeConfirmation
      ? confirmationContent[$activeConfirmation.params.type]
      : undefined,
  );
</script>

{@render children()}

{#snippet contentSlot()}
  {#if ContentComponent && $activeConfirmation}
    <ContentComponent params={$activeConfirmation.params} />
  {/if}
{/snippet}

{#if $activeConfirmation?.message}
  <ConfirmationDialog
    title={$activeConfirmation.title}
    message={$activeConfirmation.message}
    detail={$activeConfirmation.detail}
    buttonText={$activeConfirmation.buttonText}
    cancelText={$activeConfirmation.cancelText}
    operation={$activeConfirmation.operation}
    challenge={$activeConfirmation.challenge}
    preflight={$activeConfirmation.preflight}
    content={ContentComponent ? contentSlot : undefined}
    onAction={(action, isPreflightEnabled) => {
      if (action === "confirm") {
        $activeConfirmation.onConfirm(isPreflightEnabled);
      }

      if (action === "cancel") {
        $activeConfirmation.onCancel?.();
      }

      hideConfirmation();
    }}
  />
{/if}
