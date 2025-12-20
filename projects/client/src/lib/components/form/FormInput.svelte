<script lang="ts">
  import { writable } from "$lib/utils/store/WritableSubject";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import type { FormInputProps } from "./models/FormInputProps";

  const randomId = crypto.randomUUID().slice(0, 8);
  const ERROR_LABEL_ID = `trakt-input-error-${randomId}`;

  const {
    onChange,
    disabled,
    placeholder,
    value,
    autofocus = false,
    validation,
  }: FormInputProps = $props();

  let inputElement: HTMLInputElement;

  const errorText = writable<string | undefined>(undefined);

  const handleInput = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;

    if (validation) {
      const isValid = validation.isValid(newValue);
      errorText.set(isValid ? undefined : validation.errorText);
      inputElement.setCustomValidity(!isValid ? validation.errorText : "");
    }

    onChange(newValue);
  };

  onMount(() => {
    if (!autofocus) return;

    requestAnimationFrame(() => {
      inputElement.focus();
    });
  });

  const hasError = $derived(Boolean($errorText));
</script>

<div class="trakt-form-input-container">
  <input
    bind:this={inputElement}
    class="trakt-form-input"
    class:has-error={hasError}
    type="text"
    {placeholder}
    {disabled}
    {value}
    oninput={handleInput}
    aria-invalid={hasError ? "true" : "false"}
    aria-describedby={hasError ? ERROR_LABEL_ID : undefined}
  />

  {#if hasError}
    <p
      id={ERROR_LABEL_ID}
      class="trakt-input-error"
      transition:slide={{ duration: 150 }}
    >
      {$errorText}
    </p>
  {/if}
</div>

<style>
  .trakt-form-input-container {
    --color-input-focus: var(--purple-500);
    --color-input-error: var(--red-600);

    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .trakt-form-input {
    all: unset;

    height: var(--ni-40);
    width: 100%;

    padding: var(--ni-8) var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    background: var(--color-input-background);

    outline: var(--border-thickness-xxs) solid var(--color-border);
    outline-offset: calc(-1 * var(--border-thickness-xxs));

    transition: var(--transition-increment) ease-in-out;
    transition-property:
      outline, border-color, background-color, padding, width, top, left,
      opacity;

    backdrop-filter: blur(var(--ni-8));

    &:placeholder-shown {
      text-overflow: ellipsis;
    }

    &:focus-within {
      outline-color: var(--color-input-focus);
      opacity: 1;
    }

    &.has-error {
      outline-color: var(--color-input-error);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .trakt-input-error {
    color: var(--color-input-error);
    padding: 0 var(--ni-4);
  }
</style>
