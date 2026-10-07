<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { VipCancelButtonProps } from "./VipCancelButtonProps.ts";

  const {
    look,
    label,
    onclick,
    href,
    target,
    disabled,
    children,
  }: VipCancelButtonProps =
    $props();

  const isPrimary = $derived(look === "primary");
</script>

<Button
  {label}
  {onclick}
  {href}
  {target}
  {disabled}
  color={isPrimary ? "custom" : "default"}
  variant="primary"
  style={isPrimary ? "flat" : "outline"}
  text="uppercase"
  --color-background-custom="var(--purple-500)"
  --color-foreground-custom="var(--shade-10)"
>
  {@render children()}
</Button>
