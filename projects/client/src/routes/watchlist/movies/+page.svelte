<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.your_watchlist_movies()}
>
  <TraktPageCoverSetter />

  <WatchlistPaginatedList
    title={m.your_watchlist_movies()}
    emptyMessage={m.watchlist_movies_empty()}
    type="movie"
  />
</TraktPage>
