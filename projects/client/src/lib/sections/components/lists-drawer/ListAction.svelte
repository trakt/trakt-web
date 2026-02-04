<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { useIsListed } from "$lib/stores/useIsListed";
  import type { Snippet } from "svelte";

  type ListActionProps = {
    size?: "normal" | "small";
    style?: "normal" | "action" | "dropdown-item";
    title: string;
    media: MediaEntry;
    onClick: () => void;
    disabled?: boolean;
    icon?: Snippet;
  };

  const {
    size,
    style = "normal",
    title,
    media,
    onClick,
    disabled,
    icon: externalIcon,
  }: ListActionProps = $props();

  const { isLoading, isListed } = $derived(useIsListed(media));

  const isDisabled = $derived(disabled || $isLoading);

  const variant = $derived($isListed ? "primary" : "secondary");
  const text = $derived(
    $isListed ? m.button_text_listed() : m.button_text_lists(),
  );
  const state = $derived($isListed ? "added" : "missing");
</script>

{#snippet listIcon(size?: "small" | "normal")}
  {#if externalIcon}
    {@render externalIcon()}
  {:else}
    <BookmarkIcon {state} {size} />
  {/if}
{/snippet}

{#if style === "normal"}
  <Button
    style="flat"
    color="blue"
    {size}
    {variant}
    label={m.dropdown_label_add_remove_from_lists({ title })}
    disabled={isDisabled}
    onclick={onClick}
  >
    {text}

    {#snippet icon()}
      {@render listIcon(size)}
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton
    label={m.dropdown_label_add_remove_from_lists({ title })}
    onclick={onClick}
    style="ghost"
    disabled={isDisabled}
  >
    {@render listIcon(size)}
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem
    onclick={onClick}
    style="flat"
    color="default"
    variant="secondary"
    label={m.dropdown_label_add_remove_from_lists({ title })}
    disabled={isDisabled}
  >
    {`${text}…`}
    {#snippet icon()}
      {@render listIcon(size)}
    {/snippet}
  </DropdownItem>
{/if}
