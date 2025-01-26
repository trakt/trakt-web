<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";

  import RecommendedPaginatedList from "$lib/sections/lists/recommended/RecommendedPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.recommended_movies()}
>
  <RecommendedPaginatedList title={m.recommended_movies()} type="movie" />
</TraktPage>
