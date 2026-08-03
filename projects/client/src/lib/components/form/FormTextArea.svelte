<script lang="ts">
  import { onMount } from "svelte";
  import { createValidationState } from "./_internal/createValidationState.ts";
  import FormElementWrapper from "./_internal/FormElementWrapper.svelte";
  import type { FormInputProps } from "./models/FormInputProps";

  const randomId = crypto.randomUUID().slice(0, 8);
  const errorLabelId = `trakt-textarea-error-${randomId}`;

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

  const { hasError, validate } = createValidationState(() => validation);

  const handleInput = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;

    validate(textAreaElement, newValue);
    onChange(newValue);
  };

  onMount(() => {
    if (value) {
      validate(textAreaElement, value);
    }

    if (!autofocus) return;

    requestAnimationFrame(() => {
      textAreaElement.focus();
    });
  });
</script>

<FormElementWrapper {validation} hasError={$hasError} {errorLabelId}>
  <textarea
    bind:this={textAreaElement}
    {disabled}
    {placeholder}
    {value}
    {rows}
    {required}
    oninput={handleInput}
    aria-invalid={$hasError ? "true" : "false"}
    aria-describedby={$hasError ? errorLabelId : undefined}
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
