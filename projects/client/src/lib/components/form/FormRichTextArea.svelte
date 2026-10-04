<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import RichTextEditor from "$lib/components/rich-text/RichTextEditor.svelte";
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration.ts";
  import type { FormRichTextAreaProps } from "./models/FormRichTextAreaProps.ts";

  const randomId = crypto.randomUUID().slice(0, 8);
  const hintId = `trakt-rich-textarea-hint-${randomId}`;

  const duration = useMotionDuration();

  const {
    onChange,
    disabled,
    placeholder,
    value = "",
    autofocus = false,
    validation,
    actions,
    mentions,
    attachment,
  }: FormRichTextAreaProps = $props();

  let hasBlurred = $state(false);

  const isInvalid = $derived(
    validation != null && !validation.isValid(value),
  );

  const hasError = $derived(
    isInvalid && hasBlurred && value.trim() !== "",
  );
</script>

{#snippet field(surface: Snippet)}
  <div class="rich-textarea-row">
    <div class="rich-textarea-field" class:has-hint={validation != null}>
      {@render surface()}

      <p id={hintId} class="field-hint">
        {#if isInvalid}
          <span class="secondary tag bold" transition:fade={{ duration: $duration(150) }}>
            {validation?.errorText}
          </span>
        {/if}
      </p>
    </div>

    {@render attachment?.()}
  </div>
{/snippet}

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
>
  <RichTextEditor
    {value}
    {onChange}
    {placeholder}
    label={placeholder}
    {disabled}
    {autofocus}
    {mentions}
    {field}
    describedBy={hintId}
    toolbarActions={actions}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-form-rich-textarea {
    .rich-textarea-row {
      display: flex;

      container-type: inline-size;
    }

    .rich-textarea-field {
      flex: 1;
      min-width: 0;
      position: relative;
      min-height: var(--rich-textarea-min-height, var(--ni-144));

      padding: var(--ni-16);
      box-sizing: border-box;

      color: var(--color-text-primary);

      @include input-field-surface;

      &.has-hint {
        padding-block-end: var(--ni-36);
      }
    }

    &.has-error .rich-textarea-field {
      border-color: var(--color-input-error);
    }

    .field-hint {
      position: absolute;
      inset-inline: var(--ni-14);
      inset-block-end: var(--ni-12);

      margin: 0;
      text-align: end;
      pointer-events: none;

      span {
        transition: color var(--transition-increment) ease-in-out;
      }
    }

    &.has-error .field-hint span {
      color: var(--color-input-error);
    }
  }
</style>
