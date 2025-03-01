<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import { attachWarning } from "../_internal/attachWarning";
  import type { DropButtonProps } from "./DropButtonProps";

  const { title, onDrop, isDropping, style, ...props }: DropButtonProps =
    $props();

  const handler = attachWarning(onDrop, m.drop_show_warning({ title }));

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: false, color: "default" }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.drop_show_label({ title }),
    color: $color,
    variant: $variant,
    onclick: handler,
    disabled: isDropping,
    ...events,
  });

  const text = m.drop_show();
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
