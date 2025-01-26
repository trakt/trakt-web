<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";

  import TrendingPaginatedList from "$lib/sections/lists/trending/TrendingPaginatedList.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.trending_shows()}
>
  <TrendingPaginatedList title={m.trending_shows()} type="show" />
</TraktPage>
