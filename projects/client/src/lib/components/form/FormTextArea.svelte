<script lang="ts">
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { onMount } from "svelte";
  import FormElementWrapper from "./_internal/FormElementWrapper.svelte";
  import type { FormInputProps } from "./models/FormInputProps";

  const randomId = crypto.randomUUID().slice(0, 8);
  const ERROR_LABEL_ID = `trakt-textarea-error-${randomId}`;

  const {
    onChange,
    disabled,
    placeholder,
    value,
    autofocus = false,
    validation,
    rows = 5,
    required,
  }: FormInputProps & {
    rows?: number;
  } = $props();

  let textAreaElement: HTMLTextAreaElement;

  const errorText = writable<string | undefined>(undefined);

  const handleInput = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;

    if (validation) {
      const isValid = validation.isValid(newValue);
      errorText.set(isValid ? undefined : validation.errorText);
      textAreaElement.setCustomValidity(!isValid ? validation.errorText : "");
    }

    onChange(newValue);
  };

  onMount(() => {
    if (!autofocus) return;

    requestAnimationFrame(() => {
      textAreaElement.focus();
    });
  });

  const hasError = $derived(Boolean($errorText));
</script>

<FormElementWrapper {validation} {hasError}>
  <textarea
    bind:this={textAreaElement}
    {disabled}
    {placeholder}
    {value}
    {rows}
    {required}
    oninput={handleInput}
    aria-invalid={hasError ? "true" : "false"}
    aria-describedby={hasError ? ERROR_LABEL_ID : undefined}
    class="trakt-form-textarea"
  ></textarea>
</FormElementWrapper>

<style>
  .trakt-form-textarea {
    all: unset;
    flex-grow: 1;
    width: 100%;

    padding: var(--ni-12);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    border: var(--border-thickness-xxs) var(--color-border) solid;

    color: var(--color-text-primary);
    background-color: var(--color-input-background);

    transition: border-color var(--transition-increment) ease-in-out;

    backdrop-filter: blur(var(--ni-4));

    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    &:focus-within {
      border-color: var(--color-input-focus);
    }

    &[aria-invalid="true"] {
      border-color: var(--color-input-error);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
</style>
