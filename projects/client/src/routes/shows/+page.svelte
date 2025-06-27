<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import AnticipatedList from "$lib/sections/lists/anticipated/AnticipatedList.svelte";
  import HotList from "$lib/sections/lists/hot/HotList.svelte";
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
    title={m.list_title_trending()}
    drilldownLabel={m.view_all_trending_shows()}
    {type}
  />
  <HotList
    title={m.list_title_hot()}
    drilldownLabel={m.view_all_hot_shows()}
    {type}
  />
  <RenderFor audience="authenticated">
    <RecommendedList
      title={m.list_title_recommendations()}
      drilldownLabel={m.view_all_recommended_shows()}
      {type}
    />
  </RenderFor>
  <AnticipatedList
    drilldownLabel={m.view_all_anticipated_shows()}
    title={m.list_title_most_anticipated()}
    {type}
  />
  <PopularList
    drilldownLabel={m.view_all_popular_shows()}
    title={m.list_title_most_popular()}
    {type}
  />
</TraktPage>
