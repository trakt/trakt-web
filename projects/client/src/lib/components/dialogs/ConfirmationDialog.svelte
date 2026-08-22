<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import type { Confirmation } from "$lib/features/confirmation/models/Confirmation";
  import type { ConfirmationAction } from "$lib/features/confirmation/models/ConfirmationAction";
  import * as m from "$lib/features/i18n/messages.ts";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import type { Snippet } from "svelte";
  import Modal from "./Modal.svelte";

  const {
    title,
    message,
    detail,
    buttonText,
    cancelText: externalCancelText,
    onAction,
    operation,
    challenge,
    preflight,
    content,
  }: Omit<Confirmation, "message"> & {
    message: string;
    content?: Snippet;
    onAction: (action: ConfirmationAction, isPreflightEnabled: boolean) => void;
  } = $props();

  const isDestructive = $derived(operation === "destructive");
  const isPreventative = $derived(operation === "preventative");
  const cancelText = $derived(externalCancelText ?? m.button_text_cancel());

  let preflightOverride = $state<boolean | null>(null);
  const isPreflightEnabled = $derived(
    preflightOverride ?? preflight?.isEnabledByDefault ?? false,
  );
  let challengeInput = $state("");
  const isConfirmDisabled = $derived(
    challenge != null &&
      challengeInput.trim().toLowerCase() !== challenge.value.toLowerCase(),
  );
</script>

<Modal onClose={() => onAction("cancel", isPreflightEnabled)}>
  <div class="trakt-confirmation-content">
    <h2 class="title bold">{title}</h2>
    <p class="trakt-confirmation-message secondary">{message}</p>
    {#if detail}
      <p class="trakt-confirmation-message secondary">{detail}</p>
    {/if}

    {#if content}
      <div class="trakt-confirmation-slot">
        {@render content()}
      </div>
    {/if}

    {#if preflight}
      <div class="trakt-confirmation-preflight">
        <div class="preflight-copy">
          <p aria-hidden="true">{preflight.label}</p>
          {#if preflight.hint}
            <p class="small secondary">{preflight.hint}</p>
          {/if}
        </div>
        <Switch
          label={preflight.label}
          checked={isPreflightEnabled}
          onclick={() => (preflightOverride = !isPreflightEnabled)}
        />
      </div>
    {/if}

    {#if challenge}
      <label class="trakt-confirmation-challenge">
        <span class="small secondary">{challenge.label}</span>
        <FormInput
          placeholder={challenge.placeholder ?? ""}
          onChange={(value) => (challengeInput = value)}
          disabled={false}
          autofocus
        />
      </label>
    {/if}
  </div>

  {#snippet footer()}
    <div class="trakt-confirmation-actions" data-operation={operation}>
      <Button
        size="small"
        style={isPreventative ? "flat" : "outline"}
        color={isPreventative ? "blue" : "default"}
        label={cancelText}
        onclick={() => onAction("cancel", isPreflightEnabled)}
      >
        {cancelText}
      </Button>
      <Button
        size="small"
        style={isPreventative ? "outline" : "flat"}
        variant="primary"
        color={isDestructive ? "custom" : "default"}
        label={buttonText}
        disabled={isConfirmDisabled}
        onclick={() => onAction("confirm", isPreflightEnabled)}
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

  .trakt-confirmation-slot {
    margin-top: var(--ni-8);
  }

  .trakt-confirmation-preflight {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    box-sizing: border-box;
    padding: var(--gap-m);
    margin-top: var(--ni-8);

    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
  }

  .trakt-confirmation-preflight :global(.trakt-switch) {
    flex-shrink: 0;
  }

  .preflight-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .preflight-copy p {
    margin: 0;
  }

  .trakt-confirmation-challenge {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    margin-top: var(--ni-8);
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

  .trakt-confirmation-actions[data-operation="destructive"] {
    --color-background-custom: var(--color-confirmation-destructive-background);
    --color-foreground-custom: var(--color-confirmation-destructive-foreground);
  }
</style>
