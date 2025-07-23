<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { type TraktButtonProps } from "$lib/components/buttons/TraktButtonProps";

  type ToggleTagProps = Pick<
    TraktButtonProps,
    "disabled" | "label" | "onclick"
  > & {
    isPressed: boolean;
  };

  const {
    children,
    disabled,
    label,
    onclick,
    isPressed,
  }: ToggleTagProps & ChildrenProps = $props();

  const pressedState = $derived(isPressed ? "true" : "false");
</script>

<Button
  {disabled}
  {label}
  {onclick}
  variant="primary"
  color="purple"
  size="tag"
  style={isPressed ? "flat" : "ghost"}
  aria-pressed={pressedState}
>
  {@render children()}
</Button>
