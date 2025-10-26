<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import RestoreIcon from "$lib/components/icons/RestoreIcon.svelte";
  import type { RestoreButtonProps } from "./RestoreButtonProps";

  const { title, onRestore, isRestoring, style, ...props }: RestoreButtonProps =
    $props();

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: false, color: "default" }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_restore_show({ title }),
    color: $color,
    variant: $variant,
    onclick: onRestore,
    disabled: isRestoring,
    ...events,
  });

  const text = m.button_text_restore_show();
</script>

{#if style === "normal"}
  <Button {...commonProps} {...props}>
    {text}
    {#snippet icon()}
      <RestoreIcon />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton {...commonProps} {...props}>
    <RestoreIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    {text}
    {#snippet icon()}
      <RestoreIcon />
    {/snippet}
  </DropdownItem>
{/if}
