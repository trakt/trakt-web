<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListMeta from "$lib/sections/lists/components/ListMeta.svelte";
  import ListReorderDrawer from "$lib/sections/lists/user/ListReorderDrawer.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting.ts";
  import ListReorderButton from "$lib/sections/lists/user/ListReorderButton.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import { useWatchListItemCount } from "$lib/sections/lists/watchlist/useWatchListItemCount.ts";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants.ts";

  const { mode, current: currentDiscoverMode } = useDiscover();
  const { filterMap } = useFilter();

  const { current, update, options, urlBuilder } = useListSorting({
    type: "watchlist",
    intent: "default",
  });

  const { itemCount } = $derived(
    useWatchListItemCount({
      intent: "default",
      type: $mode,
      filter: $filterMap,
      sortBy: $current.sorting.value,
      sortHow: $current.sortHow,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

  let showReorderList = $state(false);
</script>

{#snippet listMetaInfo()}
  <ListMeta
    itemCount={$itemCount?.count}
    isPartialCount={$itemCount?.isPartial ?? false}
    metaText={$currentDiscoverMode.text()}
    showOwner={false}
    showLike={false}
  />
{/snippet}

{#snippet listActions()}
  <PopupMenu
    label={m.button_label_popup_menu({ title: m.list_title_watchlist() })}
    mode="standalone"
    title={m.list_title_watchlist()}
  >
    {#snippet items()}
      <ListReorderButton
        title={m.list_title_watchlist()}
        onclick={() => (showReorderList = true)}
      />
    {/snippet}
  </PopupMenu>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_watchlist()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_watchlist(),
      metaInfo: listMetaInfo,
      actions: listActions,
    }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        onUpdate={update}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <WatchlistPaginatedList
    type={$mode}
    sortBy={$current.sorting.value}
    sortHow={$current.sortHow}
  />
</TraktPage>

{#if showReorderList}
  <ListReorderDrawer
    title={m.list_title_watchlist()}
    source={{ type: "watchlist" }}
    onClose={() => (showReorderList = false)}
  />
{/if}
