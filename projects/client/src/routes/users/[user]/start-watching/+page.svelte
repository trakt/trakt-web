<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode, current: currentDiscoverMode } = useDiscover();

  const { current, update, options, urlBuilder } = useListSorting({
    type: "watchlist",
    intent: "start",
  });
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_start_watching()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_start_watching(),
      metaInfo: $currentDiscoverMode.text(),
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
  </NavbarStateSetter>

  <WatchlistPaginatedList
    intent="start"
    sortBy={$current.sorting.value}
    sortHow={$current.sortHow}
    type={$mode}
  />
</TraktPage>
