<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { useListedOnIds } from "$lib/stores/useListedOnIds";
  import ListDropdownItem from "./ListDropdownItem.svelte";

  const {
    onClose,
    metaInfo,
    media,
    title,
    onLoading,
  }: {
    onClose: () => void;
    title?: string;
    metaInfo?: string;
    media: MediaEntry;
    onLoading?: (isLoading: boolean) => void;
  } = $props();

  const { lists, isLoading: isLoadingLists } = useAllPersonalLists();
  const { listedOnIds, isLoading: isLoadingIds } = $derived(
    useListedOnIds({ media }),
  );

  const listedOnIdsSet = $derived(new Set($listedOnIds));
  const sortedLists = $derived(
    $lists.toSorted((a, b) => {
      const aListed = listedOnIdsSet.has(a.id);
      const bListed = listedOnIdsSet.has(b.id);
      if (aListed === bListed) return 0;
      return aListed ? -1 : 1;
    }),
  );

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist({ media, type: media.type }));

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title: title ?? media.title,
      onConfirm: removeFromWatchlist,
    }),
  );

  const isLoading = $derived($isLoadingIds || $isLoadingLists);
  const isEmpty = $derived($lists.length === 0);

  $effect(() => {
    onLoading?.($isWatchlistUpdating);
  });
</script>

<Drawer {onClose} title={m.header_add_to_list()} {metaInfo}>
  <ul>
    <WatchlistButton
      title={title ?? media.title}
      type="dropdown-item"
      size="normal"
      isWatchlistUpdating={$isWatchlistUpdating}
      isWatchlisted={$isWatchlisted}
      onAdd={addToWatchlist}
      onRemove={confirmRemove}
    />

    {#if isEmpty && isLoading}
      <LoadingIndicator />
    {:else}
      {#each sortedLists as list (list.id)}
        <ListDropdownItem
          title={title ?? media.title}
          {list}
          {onLoading}
          {media}
          isListed={listedOnIdsSet.has(list.id)}
        />
      {/each}
    {/if}
  </ul>
</Drawer>

<style>
  ul {
    all: unset;

    display: grid;
    grid-template-columns: 100%;

    gap: var(--gap-xxs);

    :global(li) {
      flex-direction: row-reverse;
      justify-content: space-between;
    }
  }
</style>
