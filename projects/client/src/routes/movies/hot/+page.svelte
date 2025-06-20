<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import HotPaginatedList from "$lib/sections/lists/hot/HotPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.hot_movies()}
>
  <TraktPageCoverSetter />

  <HotPaginatedList title={m.hot_movies()} type="movie" />
</TraktPage>
