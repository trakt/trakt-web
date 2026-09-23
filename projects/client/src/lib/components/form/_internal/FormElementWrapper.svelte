<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ValidationProps } from "../models/ValidationProps";

  const {
    children,
    validation,
    hasError,
    errorLabelId,
    actions,
  }: {
    validation?: ValidationProps;
    hasError: boolean;
    errorLabelId: string;
    actions?: Snippet;
  } & ChildrenProps = $props();
</script>

<div class="trakt-form-element-container">
  {@render children()}

  {#if actions || validation}
    <div class="form-element-footer">
      {@render actions?.()}

      {#if validation}
        <p
          id={errorLabelId}
          class="trakt-input-error secondary tag"
          class:has-error={hasError}
        >
          {validation.errorText}
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .trakt-form-element-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .form-element-footer {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-input-error {
    flex-grow: 1;
    padding: 0 var(--ni-4);
    text-align: end;

    transition: color var(--transition-increment) ease-in-out;

    &.has-error {
      color: var(--color-input-error);
    }
  }
</style>
