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
  import ListSearchButton from "$lib/sections/lists/user/ListSearchButton.svelte";
  import ListSearchInput from "$lib/sections/lists/user/ListSearchInput.svelte";
  import ListSearchLayout from "$lib/sections/lists/user/ListSearchLayout.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import type { ListSearchCopy } from "$lib/sections/lists/user/models/ListSearchCopy.ts";
  import { useListSearch } from "$lib/sections/lists/user/useListSearch.svelte.ts";
  import { useWatchListItemCount } from "$lib/sections/lists/watchlist/useWatchListItemCount.ts";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants.ts";

  const { mode, current: currentDiscoverMode } = useDiscover();
  const { filterMap } = useFilter();

  const { current, options, urlBuilder } = useListSorting({
    type: "watchlist",
    intent: "default",
  });

  const search = useListSearch();
  const searchCopy: ListSearchCopy = {
    toggle: m.button_label_search_list_items(),
    label: m.input_label_search_list_items(),
    placeholder: m.input_placeholder_search_list_items(),
  };

  // Desktop hosts the search field inside the navbar's content toggle, the
  // same panel the search page uses. Smaller screens hide that toggle, so
  // they get the standalone field above the items instead.
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const hasSearchExtension = $derived(search.isOpen && $isDesktop);

  const { itemCount } = $derived(
    useWatchListItemCount({
      intent: "default",
      type: $mode,
      filter: $filterMap,
      sortBy: $current.sorting.value,
      sortHow: $current.sortHow,
      limit: DEFAULT_DRILL_SIZE,
      terms: search.filter,
    }),
  );

  let showReorderList = $state(false);
</script>

{#snippet listSearchExtension()}
  <ListSearchInput {search} copy={searchCopy} variant="embedded" />
{/snippet}

{#snippet listMetaInfo()}
  <ListMeta
    itemCount={$itemCount}
    type={$mode}
    metaText={$currentDiscoverMode.text()}
    showOwner={false}
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

  <ResponsiveNavbarStateSetter contentToggle="discover"
    contentToggleExtension={hasSearchExtension ? listSearchExtension : null}
    hasFilters
    header={{
      title: m.list_title_watchlist(),
      metaInfo: listMetaInfo,
      actions: listActions,
    }}
  >
    {#snippet headerActions()}
      <ListSearchButton
        copy={searchCopy}
        isActive={search.isOpen}
        onclick={search.toggle}
      />
      <ListSortActions
        {options}
        urlBuilder={(sortParams) =>
          urlBuilder({ ...sortParams, terms: search.filter })}
        current={$current}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <ListSearchLayout {search} copy={searchCopy} isEmbedded={$isDesktop}>
    <WatchlistPaginatedList
      type={$mode}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
      searchTerm={search.filter}
    />
  </ListSearchLayout>
</TraktPage>

{#if showReorderList}
  <ListReorderDrawer
    title={m.list_title_watchlist()}
    source={{ type: "watchlist" }}
    onClose={() => (showReorderList = false)}
  />
{/if}
