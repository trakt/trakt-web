<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import WatchlistList from "$lib/sections/lists/watchlist/WatchlistList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.navbar_link_watchlist()}
>
  <TraktPageCoverSetter />

  <WatchlistList
    title={m.watchlist_movies()}
    drilldownLabel={m.view_all_watchlist_movies()}
    type="movie"
    status="all"
  />

  <WatchlistList
    title={m.watchlist_shows()}
    drilldownLabel={m.view_all_watchlist_shows()}
    type="show"
    status="all"
  />
</TraktPage>
