<script lang="ts">
  import QueuedIndicator from "$lib/components/badge/QueuedIndicator.svelte";
  import QueuedTag from "$lib/components/badge/QueuedTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ActionButton from "../ActionButton.svelte";
  import { FavoriteButtonIntlProvider } from "./FavoriteButtonIntlProvider";
  import type { FavoriteButtonProps } from "./FavoriteButtonProps";

  const {
    i18n = FavoriteButtonIntlProvider,
    title,
    isFavoriteUpdating,
    isFavorited,
    isQueued = false,
    style,
    onAdd,
    onRemove,
    navigationType,
    size = "normal",
    ...props
  }: FavoriteButtonProps = $props();

  const handler = $derived(isFavorited ? onRemove : onAdd);
  const state = $derived(isFavorited ? "filled" : "open");

  const label = $derived(
    isQueued
      ? `${i18n.label({ isFavorited, title })} (${m.label_queued_action()})`
      : i18n.label({ isFavorited, title }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label,
    variant: "primary",
    onclick: handler,
    // A queued action stays disabled so it can't be re-triggered while it
    // waits to sync - the pending pill signals it's already been actioned.
    disabled: isFavoriteUpdating || isQueued,
    navigationType,
    size,
  });
</script>

{#if style === "normal"}
  <Button {...commonProps} {...props} style="ghost" color="orange">
    {i18n.text({ isFavorited, title })}
    {#if isQueued}<QueuedTag />{/if}
    {#snippet icon()}
      <FavoriteIcon {state} />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <QueuedIndicator {isQueued}>
    <ActionButton {...commonProps} {...props} style="ghost" color="default">
      <FavoriteIcon {state} --icon-color="var(--color-background-orange)" />
    </ActionButton>
  </QueuedIndicator>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat" color="default">
    {i18n.text({ isFavorited, title })}
    {#if isQueued}<QueuedTag />{/if}
    {#snippet icon()}
      <FavoriteIcon {state} />
    {/snippet}
  </DropdownItem>
{/if}
