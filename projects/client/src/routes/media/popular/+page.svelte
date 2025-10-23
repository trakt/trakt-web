<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PopularPaginatedList from "$lib/sections/lists/popular/PopularPaginatedList.svelte";

  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_popular_media()}
>
  <TraktPageCoverSetter />

  <PopularPaginatedList title={m.list_title_most_popular()} type="media" />
</TraktPage>
