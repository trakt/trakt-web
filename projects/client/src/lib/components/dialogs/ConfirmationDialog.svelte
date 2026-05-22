<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { ConfirmationAction } from "$lib/features/confirmation/models/ConfirmationAction";
  import type { ConfirmationOperation } from "$lib/features/confirmation/models/ConfirmationOperation";
  import * as m from "$lib/features/i18n/messages.ts";
  import Modal from "./Modal.svelte";

  const {
    title,
    message,
    detail,
    buttonText,
    onAction,
    operation,
  }: {
    title: string;
    message: string;
    detail?: string;
    buttonText: string;
    operation: ConfirmationOperation;
    onAction: (action: ConfirmationAction) => void;
  } = $props();

  const isDestructive = $derived(operation === "destructive");
  const cancelText = $derived(m.button_text_cancel());
</script>

<Modal onClose={() => onAction("cancel")}>
  <div class="trakt-confirmation-content">
    <h2 class="title bold">{title}</h2>
    <p class="trakt-confirmation-message secondary">{message}</p>
    {#if detail}
      <p class="trakt-confirmation-message secondary">{detail}</p>
    {/if}
  </div>

  {#snippet footer()}
    <div class="trakt-confirmation-actions" data-operation={operation}>
      <Button
        size="small"
        style="ghost"
        color="custom"
        label={cancelText}
        onclick={() => onAction("cancel")}
      >
        {cancelText}
      </Button>
      <Button
        size="small"
        style={isDestructive ? "flat" : "ghost"}
        variant="primary"
        color="custom"
        label={buttonText}
        onclick={() => onAction("confirm")}
      >
        {buttonText}
      </Button>
    </div>
  {/snippet}
</Modal>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-confirmation-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .trakt-confirmation-actions {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ni-8);
  }

  .trakt-confirmation-actions :global(.trakt-button) {
    padding-inline: var(--ni-10);
    justify-content: center;
  }

  /* FIXME: make this design leading for the new button styles */
  .trakt-confirmation-actions :global(.trakt-button[data-style="ghost"]) {
    transform: none;
    margin: 0;

    color: var(--color-text-secondary);
    background: var(--color-confirmation-cancel-background);

    border-radius: calc(var(--border-radius-m) * 0.8);
  }

  .trakt-confirmation-actions
    :global(.trakt-button[data-style="ghost"]:hover:not([disabled])),
  .trakt-confirmation-actions
    :global(.trakt-button[data-style="ghost"]:focus-visible:not([disabled])) {
    background: var(--color-confirmation-cancel-background-hover);
    color: var(--color-text-primary);
  }

  .trakt-confirmation-actions
    :global(.trakt-button[data-style="ghost"]:active:not([disabled])) {
    transform: scale(0.97);
  }

  .trakt-confirmation-actions[data-operation="destructive"] {
    --color-background-custom: var(--color-confirmation-destructive-background);
    --color-foreground-custom: var(--color-confirmation-destructive-foreground);
  }
</style>
