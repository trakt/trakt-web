<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { writable } from "svelte/store";
  import ListDropdownButton from "./_internal/ListDropdownButton.svelte";
  import ListDropdownItem from "./_internal/ListDropdownItem.svelte";
  import { useIsOnAnyList } from "./_internal/useIsOnAnyList";
  import type { ListDropdownProps } from "./ListDropdownProps";
  import { useAllPersonalLists } from "./useAllPersonalLists";

  const { size, title, ...target }: ListDropdownProps = $props();

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

<ListDropdownButton
  {size}
  title={m.dropdown_label_add_remove_from_lists({ title })}
  isListed={$isListed}
  disabled={isDisabled}
>
  {#snippet items()}
    <WatchlistAction style="dropdown-item" {title} {isUpdating} {...target} />

    {#each $lists as list}
      <ListDropdownItem {title} {list} {isUpdating} {...target} />
    {/each}
  {/snippet}
</ListDropdownButton>
