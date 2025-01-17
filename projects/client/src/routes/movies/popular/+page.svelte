<script>
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import * as m from "$lib/features/i18n/messages";
  import PopularPaginatedList from "$lib/sections/lists/PopularPaginatedList.svelte";

  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.popular_movies()}
>
  <PopularPaginatedList title={m.popular_movies()} type="movie" />
</TraktPage>
