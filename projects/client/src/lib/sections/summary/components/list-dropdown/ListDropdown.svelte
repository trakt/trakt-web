<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import ListDropdownItem from "./_internal/ListDropdownItem.svelte";
  import ListsDrawer from "./_internal/ListsDrawer.svelte";
  import { useIsOnAnyList } from "./_internal/useIsOnAnyList";
  import type { ListDropdownProps } from "./ListDropdownProps";
  import { useAllPersonalLists } from "./useAllPersonalLists";

  const {
    size,
    style = "normal",
    title,
    ...target
  }: ListDropdownProps = $props();

  // FIXME: replace this when we store states in session storage
  const isUpdating = writable(false);
  const { lists, isLoading } = useAllPersonalLists();

  const { isListed } = $derived(
    useIsOnAnyList({
      lists: $lists,
      ...target,
    }),
  );

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist(target));

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title,
      onConfirm: removeFromWatchlist,
    }),
  );

  const isDisabled = $derived(
    $isLoading || $isUpdating || $isWatchlistUpdating,
  );

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const variant = $derived($isListed ? "primary" : "secondary");
  const text = $derived(
    $isListed ? m.button_text_listed() : m.button_text_lists(),
  );
  const state = $derived($isListed ? "added" : "missing");

  onMount(() => {
    return isOpen.subscribe((open) => {
      if (!open) {
        return;
      }

      $isWatchlisted ? confirmRemove() : addToWatchlist();
    });
  });
</script>

{#snippet dropdownItems()}
  <WatchlistButton
    {title}
    type="dropdown-item"
    size="normal"
    isWatchlistUpdating={$isWatchlistUpdating}
    isWatchlisted={$isWatchlisted}
    onAdd={addToWatchlist}
    onRemove={confirmRemove}
  />

  {#each $lists as list}
    <ListDropdownItem {title} {list} {isUpdating} {...target} />
  {/each}
{/snippet}

{#if style === "normal"}
  <Button
    style="flat"
    color="blue"
    {size}
    {variant}
    label={m.dropdown_label_add_remove_from_lists({ title })}
    disabled={isDisabled}
    onclick={() => isOpen.set(!$isOpen)}
  >
    {text}

    {#snippet icon()}
      <BookmarkIcon {state} size="normal" />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton
    label={m.dropdown_label_add_remove_from_lists({ title })}
    onclick={() => isOpen.set(!$isOpen)}
    style="ghost"
    disabled={isDisabled}
  >
    <BookmarkIcon {state} />
  </ActionButton>
{/if}

{#if $isOpen}
  <ListsDrawer {onClose}>
    {@render dropdownItems()}
  </ListsDrawer>
{/if}
