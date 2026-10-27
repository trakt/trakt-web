<script lang="ts">
  import FormInput from "$lib/components/form/FormInput.svelte";
  import type { Confirmation } from "$lib/features/confirmation/models/Confirmation";
  import type { ConfirmationAction } from "$lib/features/confirmation/models/ConfirmationAction";
  import * as m from "$lib/features/i18n/messages.ts";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import type { ComponentProps, Snippet } from "svelte";
  import DialogActions from "./DialogActions.svelte";
  import Modal from "./Modal.svelte";

  const {
    title,
    message,
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

  const cancel = () => onAction("cancel", isPreflightEnabled);
  const confirm = () => onAction("confirm", isPreflightEnabled);

  const cancelAction = $derived({ label: cancelText, onclick: cancel });
  const confirmAction = $derived({
    label: buttonText,
    onclick: confirm,
    disabled: isConfirmDisabled,
  });

  const actions: ComponentProps<typeof DialogActions> = $derived(
    operation === "preventative"
      ? {
          secondary: confirmAction,
          primary: { ...cancelAction, color: "purple", isAutofocused: true },
        }
      : {
          secondary: cancelAction,
          primary: {
            ...confirmAction,
            color: operation === "affirmative" ? "purple" : "red",
          },
        },
  );
</script>

<Modal onClose={cancel}>
  <div class="trakt-confirmation-content">
    <div class="confirmation-copy">
      <h2 class="confirmation-title">{title}</h2>
      <p class="confirmation-message secondary">{message}</p>
    </div>

    {#if content}
      {@render content()}
    {/if}

    {#if challenge}
      <label class="confirmation-challenge">
        <span class="small secondary">{challenge.label}</span>
        <FormInput
          placeholder={challenge.placeholder ?? ""}
          onChange={(value) => (challengeInput = value)}
          disabled={false}
          autofocus
        />
      </label>
    {/if}

    {#if preflight}
      <div class="confirmation-preflight">
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
  </div>

  {#snippet footer()}
    <DialogActions {...actions} />
  {/snippet}
</Modal>

<style lang="scss">
  .trakt-confirmation-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .confirmation-copy {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    .confirmation-title {
      text-wrap: pretty;
    }

    .confirmation-message {
      line-height: 1.5;
      text-wrap: pretty;
    }

    .confirmation-challenge {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    .confirmation-preflight {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-m);

      box-sizing: border-box;
      padding: var(--gap-s) var(--gap-m);

      border-radius: var(--border-radius-l);
      background: var(--color-dialog-inset);

      :global(.trakt-switch) {
        flex-shrink: 0;
      }
    }

    .preflight-copy {
      display: flex;
      flex-direction: column;
      gap: var(--gap-micro);
    }
  }
</style>
