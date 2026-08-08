<script lang="ts">
  import type { ValidationProps } from "../models/ValidationProps";

  const {
    children,
    validation,
    hasError,
    errorLabelId,
  }: {
    validation?: ValidationProps;
    hasError: boolean;
    errorLabelId: string;
  } & ChildrenProps = $props();
</script>

<div class="trakt-form-element-container">
  {@render children()}

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

<style>
  .trakt-form-element-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .trakt-input-error {
    padding: 0 var(--ni-4);
    text-align: end;

    transition: color var(--transition-increment) ease-in-out;

    &.has-error {
      color: var(--color-input-error);
    }
  }
</style>
