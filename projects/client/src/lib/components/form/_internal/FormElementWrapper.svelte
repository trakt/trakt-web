<script lang="ts">
  import type { ValidationProps } from "../models/ValidationProps";

  const randomId = crypto.randomUUID().slice(0, 8);
  const ERROR_LABEL_ID = `trakt-input-error-${randomId}`;

  const {
    children,
    validation,
    hasError,
  }: { validation?: ValidationProps; hasError: boolean } & ChildrenProps =
    $props();
</script>

<div class="trakt-form-element-container">
  {@render children()}

  {#if validation}
    <p
      id={ERROR_LABEL_ID}
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
