<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import RecentlyWatchedPaginatedList from "$lib/sections/lists/history/RecentlyWatchedPaginatedList.svelte";

  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.recently_watched_movies()}
>
  <TraktPageCoverSetter />

  <RecentlyWatchedPaginatedList
    title={m.recently_watched_movies()}
    type="movie"
  />
</TraktPage>
