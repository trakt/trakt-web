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
</script>

{#if look === "primary"}
  <Button
    {label}
    {onclick}
    {href}
    {target}
    {disabled}
    color="custom"
    variant="primary"
    style="flat"
    text="uppercase"
    --color-background-custom="var(--purple-500)"
    --color-foreground-custom="var(--shade-10)"
  >
    {@render children()}
  </Button>
{:else}
  <Button
    {label}
    {onclick}
    {href}
    {target}
    {disabled}
    color="default"
    variant="primary"
    style="outline"
    text="uppercase"
  >
    {@render children()}
  </Button>
{/if}
