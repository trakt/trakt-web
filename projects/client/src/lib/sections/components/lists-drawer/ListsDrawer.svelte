<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import type { DropdownItemFlash } from "$lib/components/dropdown/DropdownItemFlash";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { useBackgroundFlash } from "$lib/stores/useBackgroundFlash.svelte";
  import { useListedOnIds } from "$lib/stores/useListedOnIds";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ViewListLink from "./_internal/ViewListLink.svelte";
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
  const media$ = fromRune(() => media);
  const { listedOnIds, isLoading: isLoadingIds } = useListedOnIds({ media$ });

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

  const watchlistFlash = useBackgroundFlash<DropdownItemFlash>();
  let wasWatchlistUpdating = false;

  $effect(() => {
    const isUpdating = $isWatchlistUpdating;
    onLoading?.(isUpdating);

    if (wasWatchlistUpdating && !isUpdating) {
      watchlistFlash.flash($isWatchlisted ? "purple" : "red");
    }
    wasWatchlistUpdating = isUpdating;
  });

  // Rows flash off the listed-ids diff instead of the request lifecycle -
  // add/remove re-sorts the rows, and the server-state change is the one
  // signal that survives that churn.
  const rowFlash = useBackgroundFlash<{ id: number; color: DropdownItemFlash }>();
  let previousListedIds: Set<number> | null = null;

  $effect(() => {
    if ($isLoadingIds) {
      return;
    }

    const current = listedOnIdsSet;
    const previous = previousListedIds;
    previousListedIds = current;

    if (previous == null) {
      return;
    }

    const addedId = [...current].find((id) => !previous.has(id));
    const removedId = [...previous].find((id) => !current.has(id));

    if (addedId != null) {
      rowFlash.flash({ id: addedId, color: "purple" });
      return;
    }

    if (removedId != null) {
      rowFlash.flash({ id: removedId, color: "red" });
    }
  });
</script>

<Drawer {onClose} title={m.header_manage_lists()} {metaInfo}>
  <div class="lists-layout">
    <DropdownGroup>
      <WatchlistButton
        title={title ?? media.title}
        type="dropdown-item"
        size="normal"
        isWatchlistUpdating={$isWatchlistUpdating}
        isWatchlisted={$isWatchlisted}
        flash={watchlistFlash.flashing}
        onAdd={addToWatchlist}
        onRemove={confirmRemove}
      >
        {#snippet action()}
          <ViewListLink
            href={UrlBuilder.lists.watchlist("me")}
            label={m.link_label_view_watchlist()}
            tooltip={m.tooltip_view_watchlist()}
          />
        {/snippet}
      </WatchlistButton>

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
            flash={rowFlash.flashing?.id === list.id
              ? rowFlash.flashing.color
              : undefined}
          />
        {/each}
      {/if}
    </DropdownGroup>
  </div>
</Drawer>

<style>
  .lists-layout {
    /* The group's list is overflow: hidden, which zeroes its automatic
       min-size inside the drawer's scroll flexbox - without this wrapper the
       group shrinks to fit and clips instead of letting the drawer scroll. */
    flex-shrink: 0;
  }
</style>
