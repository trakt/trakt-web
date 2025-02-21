<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import AnticipatedList from "$lib/sections/lists/anticipated/AnticipatedList.svelte";
  import PopularList from "$lib/sections/lists/popular/PopularList.svelte";
  import RecommendedList from "$lib/sections/lists/recommended/RecommendedList.svelte";
  import TrendingList from "$lib/sections/lists/trending/TrendingList.svelte";

  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";

  const type = "show";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.navbar_link_shows()}
>
  <TraktPageCoverSetter />

  <TrendingList
    title={m.trending_now()}
    drilldownLabel={m.view_all_trending_shows()}
    {type}
  />
  <RenderFor audience="authenticated">
    <RecommendedList
      title={m.recommendations()}
      drilldownLabel={m.view_all_recommended_shows()}
      {type}
    />
  </RenderFor>
  <AnticipatedList
    drilldownLabel={m.view_all_anticipated_shows()}
    title={m.most_anticipated()}
    {type}
  />
  <PopularList
    drilldownLabel={m.view_all_popular_shows()}
    title={m.most_popular()}
    {type}
  />
</TraktPage>
