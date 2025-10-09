<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import ConfirmationDialog from "$lib/components/dialogs/ConfirmationDialog.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import { writable } from "svelte/store";
  import type { DropButtonProps } from "./DropButtonProps";

  const { title, onDrop, isDropping, style, ...props }: DropButtonProps =
    $props();

  const showWarning = writable(false);

  //TODO: does not work, when popup is closed this also goes
  const handler = () => showWarning.set(true);

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: false, color: "default" }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_drop_show({ title }),
    color: $color,
    variant: $variant,
    onclick: handler,
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

<ConfirmationDialog
  open={showWarning}
  message={m.warning_prompt_drop_show({ title })}
  title={text}
  confirmText="Drop it like it's hot"
  onConfirm={onDrop}
/>
