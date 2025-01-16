<script lang="ts">
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import { useDangerColor } from "../useDangerColor";
  import { attachRemoveWarning } from "./attachRemoveWarning";
  import { MarkAsWatchedButtonIntlProvider } from "./MarkAsWatchedButtonIntlProvider";
  import type { MarkAsWatchedButtonProps } from "./MarkAsWatchedButtonProps";

  const {
    i18n = MarkAsWatchedButtonIntlProvider,
    title,
    onWatch,
    onRemove,
    isMarkingAsWatched,
    isWatched,
    type,
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const handler = $derived(
    isWatched
      ? attachRemoveWarning(onRemove, i18n.warning({ isWatched, title }))
      : onWatch,
  );

  const { color, ...events } = $derived(
    useDangerColor({ isActive: isWatched }),
  );
  const variant = $derived(isWatched ? "primary" : "secondary");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title, isWatched }),
    color: $color,
    variant,
    onclick: handler,
    disabled: isMarkingAsWatched,
    ...events,
  });
</script>

{#if type === "normal"}
  <Button {...commonProps} {...props}>
    {i18n.text({ title, isWatched })}
    {#snippet icon()}
      <MarkAsWatchedIcon
        state={isWatched ? "watched" : "unwatched"}
        size="small"
      />
    {/snippet}
  </Button>
{/if}

{#if type === "action"}
  <ActionButton {...commonProps} {...props}>
    <MarkAsWatchedIcon state={isWatched ? "watched" : "unwatched"} />
  </ActionButton>
{/if}
