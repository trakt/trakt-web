<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { DropButtonProps } from "./DropButtonProps";

  const { title, onDrop, isDropping, style, ...props }: DropButtonProps =
    $props();

  const { confirm } = useConfirm();
  const confirmDrop = $derived(
    confirm({
      type: ConfirmationType.DropShow,
      title,
      onConfirm: onDrop,
    }),
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: false, color: "default" }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_drop_show({ title }),
    color: $color,
    variant: $variant,
    onclick: confirmDrop,
    disabled: isDropping,
    ...events,
  });

  const text = m.button_text_drop_show();
</script>

{#if style === "normal"}
  <Button {...commonProps} {...props}>
    {text}
    {#snippet icon()}
      <DropIcon />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton {...commonProps} {...props}>
    <DropIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    {text}
    {#snippet icon()}
      <DropIcon />
    {/snippet}
  </DropdownItem>
{/if}
