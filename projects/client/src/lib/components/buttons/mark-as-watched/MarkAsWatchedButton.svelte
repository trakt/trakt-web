<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import MarkAsWatchedIcon from "../../icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import { useDangerButton } from "../_internal/useDangerButton";
  import { MarkAsWatchedButtonIntlProvider } from "./MarkAsWatchedButtonIntlProvider";
  import type { MarkAsWatchedButtonProps } from "./MarkAsWatchedButtonProps";

  const {
    i18n = MarkAsWatchedButtonIntlProvider,
    title,
    onWatch,
    onRemove,
    onAsk,
    isMarkingAsWatched,
    isWatched,
    style,
    mode = "hybrid",
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const isRemovable = $derived(isWatched && mode === "hybrid");
  const isRewatching = $derived(mode === "ask" && isWatched);

  const handler = $derived.by(() => {
    const shouldAsk = mode === "ask" || (mode === "hybrid" && !isWatched);

    if (shouldAsk) {
      return onAsk;
    }

    return isRemovable ? onRemove : onWatch;
  });

  const preferredColor = $derived(
    style === "dropdown-item" ? "default" : "purple",
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({
      isActive: isRemovable,
      color: mode === "ask" ? "default" : preferredColor,
    }),
  );
  const state = $derived(isRemovable ? "watched" : "unwatched");

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title, isWatched, isRewatching }),
    color: $color,
    variant: mode === "ask" ? "primary" : $variant,
    onclick: handler,
    disabled: isMarkingAsWatched,
    ...events,
  });
</script>

{#if style === "normal"}
  <div data-dpad-navigation={DpadNavigationType.List} style="display: contents">
    <Button
      {...commonProps}
      {...props}
      navigationType={DpadNavigationType.Item}
    >
      {i18n.text({ title, isWatched, isRewatching })}
      {#snippet icon()}
        <MarkAsWatchedIcon {state} size="small" />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "action"}
  <ActionButton style="ghost" {...commonProps} {...props} variant="secondary">
    <MarkAsWatchedIcon {state} />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    {i18n.text({ title, isWatched, isRewatching })}
    {#snippet icon()}
      <MarkAsWatchedIcon {state} />
    {/snippet}
  </DropdownItem>
{/if}
