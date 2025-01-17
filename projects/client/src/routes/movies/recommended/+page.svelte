<script>
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import * as m from "$lib/features/i18n/messages";

  import RecommendedPaginatedList from "$lib/sections/lists/RecommendedPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.recommended_movies()}
>
  <RecommendedPaginatedList title={m.recommended_movies()} type="movie" />
</TraktPage>
