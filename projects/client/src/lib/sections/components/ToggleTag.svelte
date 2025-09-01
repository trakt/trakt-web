<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { type TraktButtonProps } from "$lib/components/buttons/TraktButtonProps";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";

  type ToggleTagProps = Pick<
    TraktButtonProps,
    "disabled" | "label" | "onclick" | "navigationType"
  > & {
    isPressed: boolean;
  };

  const {
    children,
    disabled,
    label,
    onclick,
    isPressed,
    navigationType,
  }: ToggleTagProps & ChildrenProps = $props();

  const pressedState = $derived(isPressed ? "true" : "false");
</script>

<div class="toggle-tag" class:is-checked={isPressed}>
  <Button
    {disabled}
    {label}
    {onclick}
    {navigationType}
    variant={isPressed ? "primary" : "secondary"}
    color="custom"
    size="tag"
    style="flat"
    aria-pressed={pressedState}
    --color-background-custom="var(--color-background-progress-tag)"
    --color-foreground-custom="var(--color-foreground-stem-tag)"
  >
    {@render children()}

    {#snippet icon()}
      {#if isPressed}
        <CheckIcon />
      {/if}
    {/snippet}
  </Button>
</div>

<style>
  .toggle-tag {
    :global(.trakt-button) {
      flex-direction: row-reverse;

      gap: var(--gap-xxs);
    }

    :global(.trakt-button[data-size="tag"] .button-icon svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }

    &:not(.is-checked) {
      :global(.button-icon) {
        display: none;
      }
    }
  }
</style>
