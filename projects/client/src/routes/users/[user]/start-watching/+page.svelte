<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting.ts";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
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

  <ResponsiveNavbarStateSetter
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
  </ResponsiveNavbarStateSetter>

  <WatchlistPaginatedList
    intent="start"
    sortBy={$current.sorting.value}
    sortHow={$current.sortHow}
    type={$mode}
  />
</TraktPage>
