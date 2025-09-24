<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ListedIcon from "$lib/components/icons/ListedIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { writable } from "svelte/store";
  import ListDropdownButton from "./_internal/ListDropdownButton.svelte";
  import ListDropdownItem from "./_internal/ListDropdownItem.svelte";
  import { useIsOnAnyList } from "./_internal/useIsOnAnyList";
  import type { ListDropdownProps } from "./ListDropdownProps";
  import { useAllPersonalLists } from "./useAllPersonalLists";

  const { size, style, title, ...target }: ListDropdownProps = $props();

  // FIXME: replace this when we store states in session storage
  const isUpdating = writable(false);
  const { lists, isLoading } = useAllPersonalLists();

  const { isListed } = $derived(
    useIsOnAnyList({
      lists: $lists,
      ...target,
    }),
  );

  const isDisabled = $derived($isLoading || $isUpdating);
</script>

{#snippet dropdownItems()}
  <WatchlistAction style="dropdown-item" {title} {isUpdating} {...target} />

  {#each $lists as list}
    <ListDropdownItem {title} {list} {isUpdating} {...target} />
  {/each}
{/snippet}

{#if style === "normal"}
  <ListDropdownButton
    {size}
    title={m.dropdown_label_add_remove_from_lists({ title })}
    isListed={$isListed}
    disabled={isDisabled}
  >
    {#snippet items()}
      {@render dropdownItems()}
    {/snippet}
  </ListDropdownButton>
{/if}

{#if style === "popup"}
  <PopupMenu
    label={m.dropdown_label_add_remove_from_lists({ title })}
    size="normal"
    disabled={isDisabled}
  >
    {#snippet icon()}
      {#if $isListed}
        <ListedIcon />
      {:else}
        <PlusIcon />
      {/if}
    {/snippet}
    {#snippet items()}
      {@render dropdownItems()}
    {/snippet}
  </PopupMenu>
{/if}
