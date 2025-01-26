<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import TrendingPaginatedList from "$lib/sections/lists/trending/TrendingPaginatedList.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.trending_shows()}
>
  <TraktPageCoverSetter />

  <TrendingPaginatedList title={m.trending_shows()} type="show" />
</TraktPage>
