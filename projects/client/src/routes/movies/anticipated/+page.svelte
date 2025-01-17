<script>
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import * as m from "$lib/features/i18n/messages";

  import AnticipatedPaginatedList from "$lib/sections/lists/AnticipatedPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.anticipated_movies()}
>
  <AnticipatedPaginatedList title={m.anticipated_movies()} type="movie" />
</TraktPage>
