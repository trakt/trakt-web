<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import { attachRemoveWarning } from "../_internal/attachRemoveWarning";
  import { useDangerButton } from "../_internal/useDangerButton";
  import { WatchlistButtonIntlProvider } from "./WatchlistButtonIntlProvider";
  import type { WatchlistButtonProps } from "./WatchlistButtonProps";

  const {
    i18n = WatchlistButtonIntlProvider,
    title,
    isWatchlistUpdating,
    isWatchlisted,
    type,
    onAdd,
    onRemove,
    ...props
  }: WatchlistButtonProps = $props();

  const handler = $derived(
    isWatchlisted
      ? attachRemoveWarning(onRemove, i18n.warning({ isWatchlisted, title }))
      : onAdd,
  );
  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: isWatchlisted, color: "blue" }),
  );
  const state = $derived(isWatchlisted ? "added" : "missing");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ isWatchlisted, title }),
    color: $color,
    variant: $variant,
    onclick: handler,
    disabled: isWatchlistUpdating,
    ...events,
  });
</script>

{#if type === "normal"}
  <Button {...commonProps} {...props}>
    {i18n.text({ isWatchlisted, title })}
    {#snippet icon()}
      <WatchlistIcon size="small" {state} />
    {/snippet}
  </Button>
{/if}

{#if type === "action"}
  <ActionButton {...commonProps} {...props}>
    <WatchlistIcon {state} />
  </ActionButton>
{/if}
