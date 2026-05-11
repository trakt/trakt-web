<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { ConfirmationAction } from "$lib/features/confirmation/models/ConfirmationAction";
  import type { ConfirmationOperation } from "$lib/features/confirmation/models/ConfirmationOperation";
  import * as m from "$lib/features/i18n/messages.ts";
  import Modal from "./Modal.svelte";

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

  const title = $derived(`${buttonText}?`);
</script>

<Modal onClose={() => onAction("cancel")}>
  <h2 class="confirmation-title">{title}</h2>
  <div class="confirmation-message-container">
    {#each message.split(/(?<=[.!?])\s+/) as sentence}
      <p class="confirmation-message">{sentence}</p>
    {/each}
  </div>

  {#snippet footer()}
    <div class={operation === "destructive" ? "destructive-action" : "affirmative-action"} style="display: contents;">
      <Button
        size="small"
        variant="primary"
        color="custom"
        label={buttonText}
        onclick={() => onAction("confirm")}
      >
        {buttonText}
      </Button>
    </div>
    <Button
      size="small"
      style="ghost"
      color="default"
      label={m.button_text_cancel()}
      onclick={() => onAction("cancel")}
    >
      {m.button_text_cancel()}
    </Button>
  {/snippet}
</Modal>

<style lang="scss">
  .confirmation-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
    line-height: 1.3;
  }

  .confirmation-message-container {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .confirmation-message {
    color: var(--color-text-secondary);
    font-size: 1.0625rem;
    margin: 0;
    line-height: 1.5;
  }

  :global(.affirmative-action) {
    --color-background-custom: #fefefe;
    --color-foreground-custom: #212427;
  }

  :global(.destructive-action) {
    --color-background-custom: #fefefe;
    --color-foreground-custom: var(--red-600);
  }
</style>
