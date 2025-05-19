<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import { attachRemoveWarning } from "../_internal/attachRemoveWarning";
  import { useDangerButton } from "../_internal/useDangerButton";
  import { FavoriteButtonIntlProvider } from "./FavoriteButtonIntlProvider";
  import type { FavoriteButtonProps } from "./FavoriteButtonProps";

  const {
    i18n = FavoriteButtonIntlProvider,
    title,
    isFavoriteUpdating,
    isFavorited,
    type,
    onAdd,
    onRemove,
    ...props
  }: FavoriteButtonProps = $props();

  const handler = $derived(
    isFavorited
      ? attachRemoveWarning(onRemove, i18n.warning({ isFavorited, title }))
      : onAdd,
  );
  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: isFavorited, color: "orange" }),
  );
  const style = $derived(isFavorited ? "filled" : "open");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ isFavorited, title }),
    color: $color,
    variant: $variant,
    onclick: handler,
    disabled: isFavoriteUpdating,
    ...events,
  });
</script>

{#if type === "normal"}
  <Button {...commonProps} {...props} style="ghost" variant="secondary">
    {i18n.text({ isFavorited, title })}
    {#snippet icon()}
      <FavoriteIcon {style} />
    {/snippet}
  </Button>
{/if}

{#if type === "action"}
  <ActionButton {...commonProps} {...props}>
    <FavoriteIcon {style} />
  </ActionButton>
{/if}
