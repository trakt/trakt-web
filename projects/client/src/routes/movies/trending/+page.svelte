<script>
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import * as m from "$lib/features/i18n/messages";

  import TrendingPaginatedList from "$lib/sections/lists/TrendingPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.trending_movies()}
>
  <TrendingPaginatedList title={m.trending_movies()} type="movie" />
</TraktPage>
