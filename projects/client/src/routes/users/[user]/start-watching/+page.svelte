<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();
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
      metaInfo: $current.text(),
    }}
  />

  <WatchlistPaginatedList
    intent="start"
    type={$mode}
    sortBy="released"
    sortHow="desc"
  />
</TraktPage>
