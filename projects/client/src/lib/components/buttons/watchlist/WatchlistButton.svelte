<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ActionButton from "../ActionButton.svelte";
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

  const handler = $derived(isWatchlisted ? onRemove : onAdd);

  const preferredColor = $derived(
    type === "dropdown-item" ? "default" : "blue",
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: isWatchlisted, color: preferredColor }),
  );
  const state = $derived(isWatchlisted ? "added" : "missing");

  const actionProps = $derived({
    label: i18n.label({ isWatchlisted, title }),
    onclick: handler,
    disabled: isWatchlistUpdating,
    ...events,
  });

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    color: $color,
    variant,
    ...actionProps,
  });
</script>

{#if type === "normal"}
  <div data-dpad-navigation={DpadNavigationType.List} style="display: contents">
    <Button
      {...commonProps}
      {...props}
      navigationType={DpadNavigationType.Item}
    >
      {i18n.text({ isWatchlisted, title })}
      {#snippet icon()}
        <BookmarkIcon {state} size="normal" />
      {/snippet}
    </Button>
  </div>
{/if}

{#if type === "action"}
  <ActionButton style="ghost" {...actionProps} {...props}>
    <BookmarkIcon {state} />
  </ActionButton>
{/if}

{#if type === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    {i18n.text({ isWatchlisted, title })}
    {#snippet icon()}
      <!-- FIXME: generalize this and do this for all applicable buttons/items  -->
      {#if isWatchlistUpdating}
        <LoadingIndicator />
      {:else}
        <BookmarkIcon {state} size="normal" />
      {/if}
    {/snippet}
  </DropdownItem>
{/if}
