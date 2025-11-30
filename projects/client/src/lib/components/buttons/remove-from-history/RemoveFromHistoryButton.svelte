<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import { useDangerButton } from "../_internal/useDangerButton";
  import { RemoveFromHistoryButtonIntlProvider } from "./RemoveFromHistoryButtonIntlProvider";
  import type { RemoveFromHistoryButtonProps } from "./RemoveFromHistoryButtonProps";

  const {
    i18n = RemoveFromHistoryButtonIntlProvider,
    title,
    onRemove,
    isRemoving,
    style,
    ...props
  }: RemoveFromHistoryButtonProps = $props();

  const preferredColor = $derived(
    style === "dropdown-item" ? "default" : "purple",
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: true, color: preferredColor }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title }),
    color: $color,
    variant,
    onclick: onRemove,
    disabled: isRemoving,
    ...events,
  });
</script>

{#if style === "normal"}
  <Button {...commonProps} {...props}>
    {i18n.text()}
    {#snippet icon()}
      <MarkAsWatchedIcon state="watched" size="small" />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton {...commonProps} {...props}>
    <MarkAsWatchedIcon state="watched" />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    {i18n.text()}
    {#snippet icon()}
      <MarkAsWatchedIcon state="watched" />
    {/snippet}
  </DropdownItem>
{/if}
