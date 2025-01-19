<script lang="ts">
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import { attachRemoveWarning } from "../_internal/attachRemoveWarning";
  import { useDangerButton } from "../_internal/useDangerButton";
  import { MarkAsWatchedButtonIntlProvider } from "./MarkAsWatchedButtonIntlProvider";
  import type { MarkAsWatchedButtonProps } from "./MarkAsWatchedButtonProps";

  const {
    i18n = MarkAsWatchedButtonIntlProvider,
    title,
    onWatch,
    onRemove,
    isMarkingAsWatched,
    isWatched,
    style,
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const handler = $derived(
    isWatched
      ? attachRemoveWarning(onRemove, i18n.warning({ isWatched, title }))
      : onWatch,
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: isWatched, color: "purple" }),
  );
  const state = $derived(isWatched ? "watched" : "unwatched");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title, isWatched }),
    color: $color,
    variant: $variant,
    onclick: handler,
    disabled: isMarkingAsWatched,
    ...events,
  });
</script>

{#if style === "normal"}
  <Button {...commonProps} {...props}>
    {i18n.text({ title, isWatched })}
    {#snippet icon()}
      <MarkAsWatchedIcon {state} size="small" />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton {...commonProps} {...props}>
    <MarkAsWatchedIcon {state} />
  </ActionButton>
{/if}
