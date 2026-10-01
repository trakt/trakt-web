<script lang="ts">
  import type { Snippet } from "svelte";
  import RichTextEditor from "$lib/components/rich-text/RichTextEditor.svelte";
  import type { RichTextMention } from "$lib/components/rich-text/RichTextMention.ts";
  import FormElementWrapper from "./_internal/FormElementWrapper.svelte";
  import type { FormInputProps } from "./models/FormInputProps.ts";

  const randomId = crypto.randomUUID().slice(0, 8);
  const errorLabelId = `trakt-rich-textarea-error-${randomId}`;

  const {
    onChange,
    disabled,
    placeholder,
    value = "",
    autofocus = false,
    validation,
    actions,
    mentions,
  }: FormInputProps & {
    actions?: Snippet;
    mentions?: ReadonlyArray<RichTextMention>;
  } = $props();

  let hasBlurred = $state(false);

  const hasError = $derived(
    validation != null &&
      hasBlurred &&
      value.trim() !== "" &&
      !validation.isValid(value),
  );
</script>

<FormElementWrapper {validation} {hasError} {errorLabelId} {actions}>
  <div
    class="trakt-form-rich-textarea"
    onfocusout={(event) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
        return;
      }
      hasBlurred = true;
    }}
    class:is-disabled={disabled}
    class:has-error={hasError}
    aria-describedby={hasError ? errorLabelId : undefined}
  >
    <RichTextEditor
      {value}
      {onChange}
      {placeholder}
      label={placeholder}
      {disabled}
      {autofocus}
      {mentions}
    />
  </div>
</FormElementWrapper>

<style>
  .trakt-form-rich-textarea {
    padding: var(--ni-12);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    border: var(--border-thickness-xxs) var(--color-border) solid;

    color: var(--color-text-primary);
    background-color: var(--color-input-background);

    transition: border-color var(--transition-increment) ease-in-out;

    backdrop-filter: blur(var(--ni-4));

    &:focus-within {
      border-color: var(--color-input-focus);
    }

    &.has-error {
      border-color: var(--color-input-error);
    }
  }
</style>
