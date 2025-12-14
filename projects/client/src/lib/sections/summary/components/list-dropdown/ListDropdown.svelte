<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { BehaviorSubject } from "rxjs";
  import { onMount } from "svelte";
  import ListDropdownItem from "./_internal/ListDropdownItem.svelte";
  import ListsDrawer from "./_internal/ListsDrawer.svelte";
  import { useListedOnIds } from "./_internal/useListedOnIds";
  import type { ListDropdownProps } from "./ListDropdownProps";

  const {
    size,
    style = "normal",
    title,
    lists,
    media,
    isLoadingLists,
  }: ListDropdownProps = $props();

  // FIXME: replace this when we store states in session storage
  const isUpdating = new BehaviorSubject<boolean>(false);

  const { listedOnIds, isLoading } = $derived(useListedOnIds({ media }));

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist({ media, type: media.type }));

  const isListed = $derived($listedOnIds.length > 0 || $isWatchlisted);

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title,
      onConfirm: removeFromWatchlist,
    }),
  );

  const isDisabled = $derived(
    isLoadingLists || $isUpdating || $isWatchlistUpdating || $isLoading,
  );

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const variant = $derived(isListed ? "primary" : "secondary");
  const text = $derived(
    isListed ? m.button_text_listed() : m.button_text_lists(),
  );
  const state = $derived(isListed ? "added" : "missing");

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

  {#each lists as list}
    <ListDropdownItem
      {title}
      {list}
      {isUpdating}
      {media}
      listedOnIds={$listedOnIds}
    />
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
