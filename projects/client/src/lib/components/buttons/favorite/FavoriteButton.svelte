<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import { FavoriteButtonIntlProvider } from "./FavoriteButtonIntlProvider";
  import type { FavoriteButtonProps } from "./FavoriteButtonProps";

  const {
    i18n = FavoriteButtonIntlProvider,
    title,
    isFavoriteUpdating,
    isFavorited,
    style,
    onAdd,
    onRemove,
    navigationType,
    ...props
  }: FavoriteButtonProps = $props();

  const handler = $derived(isFavorited ? onRemove : onAdd);
  const state = $derived(isFavorited ? "filled" : "open");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ isFavorited, title }),
    variant: "primary",
    onclick: handler,
    disabled: isFavoriteUpdating,
    navigationType,
  });
</script>

{#if style === "normal"}
  <Button {...commonProps} {...props} style="ghost" color="orange">
    {i18n.text({ isFavorited, title })}
    {#snippet icon()}
      <FavoriteIcon {state} />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton {...commonProps} {...props} style="ghost" color="default">
    <FavoriteIcon {state} --icon-color="var(--color-background-orange)" />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat" color="orange">
    {i18n.text({ isFavorited, title })}
    {#snippet icon()}
      <FavoriteIcon {state} />
    {/snippet}
  </DropdownItem>
{/if}
