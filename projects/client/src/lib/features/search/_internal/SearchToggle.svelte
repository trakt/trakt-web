<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { type TraktButtonProps } from "$lib/components/buttons/TraktButtonProps";
  import type { Snippet } from "svelte";

  type ToggleTagProps = Pick<
    TraktButtonProps,
    "disabled" | "label" | "onclick" | "color"
  > & {
    isPressed: boolean;
    icon?: Snippet;
  };

  const {
    children,
    disabled,
    label,
    onclick,
    isPressed,
    color,
    icon,
  }: ToggleTagProps & ChildrenProps = $props();

  const pressedState = $derived(isPressed ? "true" : "false");
</script>

<div class="toggle-tag" class:is-checked={isPressed}>
  <Button
    {disabled}
    {label}
    {onclick}
    variant={isPressed ? "primary" : "secondary"}
    {color}
    size="tag"
    style="flat"
    aria-pressed={pressedState}
    {icon}
    --color-background-custom="var(--color-background-progress-tag)"
    --color-foreground-custom="var(--color-foreground-stem-tag)"
  >
    {@render children()}
  </Button>
</div>

<style>
  .toggle-tag {
    :global(.trakt-button) {
      flex-direction: row-reverse;

      gap: var(--gap-xxs);
    }

    :global(.trakt-button[data-size="tag"] .button-icon svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    :global(.trakt-button[data-size="tag"]) {
      height: var(--ni-30);
      border-radius: var(--border-radius-l);
    }
  }
</style>
