<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject";
  import { onMount } from "svelte";
  import Button from "../buttons/Button.svelte";
  import type { FormProps } from "./models/FormProps";

  const {
    children,
    onSubmit,
    onCancel,
    disabled,
    isCancelDisabled = false,
    confirmButtonText,
    confirmButtonLabel,
  }: FormProps = $props();

  let formElement: HTMLFormElement;

  const isFormValid = writable(false);

  const checkFormValidity = () => {
    const isValid = formElement.checkValidity();
    isFormValid.set(isValid);
  };

  onMount(() => {
    checkFormValidity();
  });
</script>

<form
  bind:this={formElement}
  class="trakt-form"
  onsubmit={(e) => {
    e.preventDefault();
    onSubmit();
  }}
  oninput={checkFormValidity}
>
  <div class="trakt-form-content">
    {@render children()}
  </div>

  <div class="trakt-form-actions">
    <Button
      size="small"
      variant="secondary"
      color="default"
      disabled={isCancelDisabled}
      onclick={onCancel}
      label={m.button_label_cancel()}
      type="button"
    >
      {m.button_text_cancel()}
    </Button>
    <Button
      size="small"
      variant="primary"
      color="purple"
      disabled={disabled || !$isFormValid}
      label={confirmButtonLabel}
      type="submit"
    >
      {confirmButtonText}
    </Button>
  </div>
</form>

<style>
  .trakt-form,
  .trakt-form-actions {
    display: flex;
    flex-direction: column;

    gap: var(--gap-m);
  }

  .trakt-form-actions {
    gap: var(--gap-xs);

    :global(.trakt-button) {
      flex: 1;
    }
  }
</style>
