<script lang="ts">
  import QueuedIndicator from "$lib/components/badge/QueuedIndicator.svelte";
  import QueuedTag from "$lib/components/badge/QueuedTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
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
    isQueued = false,
    isLoading = false,
    style,
    mode = "hybrid",
    ...props
  }: MarkAsWatchedButtonProps = $props();

  const { user } = useUser();

  const isRemovable = $derived(isWatched && mode === "hybrid");
  const isRewatching = $derived(mode === "ask" && isWatched);
  const shouldAsk = $derived(
    mode === "ask" || (mode === "hybrid" && !isWatched),
  );

  const handler = $derived.by(() => {
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

  const label = $derived(
    isQueued
      ? `${i18n.label({ title, isWatched, isRewatching })} (${m.label_queued_action()})`
      : i18n.label({ title, isWatched, isRewatching }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label,
    color: $color,
    variant: mode === "ask" ? "primary" : variant,
    onclick: handler,
    // A queued action stays disabled so it can't be re-triggered while it
    // waits to sync - the pending pill signals it's already been actioned.
    disabled: isMarkingAsWatched || isQueued || isLoading,
    ...events,
  });

  const buttonText = $derived.by(() => {
    const postFix = shouldAsk ? "…" : "";

    return `${i18n.text({ title, isWatched, isRewatching })}${postFix}`;
  });

  const allowMarkAsWatched = $derived(
    !isRewatching || $user.preferences.hasWatchAgain,
  );
</script>

{#snippet watchIcon(size?: "small")}
  {#if isLoading}
    <LoadingIndicator />
  {:else}
    <TrackIcon {state} {size} />
  {/if}
{/snippet}

{#if allowMarkAsWatched}
  {#if style === "normal"}
    <div
      data-dpad-navigation={DpadNavigationType.List}
      style="display: contents"
    >
      <Button
        {...commonProps}
        {...props}
        navigationType={DpadNavigationType.Item}
      >
        {buttonText}
        {#if isQueued}<QueuedTag />{/if}
        {#snippet icon()}
          {@render watchIcon()}
        {/snippet}
      </Button>
    </div>
  {/if}

  {#if style === "action"}
    <QueuedIndicator {isQueued}>
      <ActionButton style="ghost" {...commonProps} {...props}>
        {@render watchIcon("small")}
      </ActionButton>
    </QueuedIndicator>
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem {...commonProps} style="flat">
      {buttonText}
      {#if isQueued}<QueuedTag />{/if}
      {#snippet icon()}
        {@render watchIcon()}
      {/snippet}
    </DropdownItem>
  {/if}
{/if}
