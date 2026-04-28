<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
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

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title, isWatched, isRewatching }),
    color: $color,
    variant: mode === "ask" ? "primary" : variant,
    onclick: handler,
    disabled: isMarkingAsWatched || isLoading,
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
    <MarkAsWatchedIcon {state} {size} />
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
        {#snippet icon()}
          {@render watchIcon("small")}
        {/snippet}
      </Button>
    </div>
  {/if}

  {#if style === "action"}
    <ActionButton style="ghost" {...commonProps} {...props}>
      {@render watchIcon()}
    </ActionButton>
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem {...commonProps} style="flat">
      {buttonText}
      {#snippet icon()}
        {@render watchIcon()}
      {/snippet}
    </DropdownItem>
  {/if}
{/if}
