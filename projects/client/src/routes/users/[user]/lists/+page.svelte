<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListRenderer from "$lib/sections/lists/smart/SmartListRenderer.svelte";
  import PersonalLists from "$lib/sections/lists/user/PersonalLists.svelte";
  import WatchList from "$lib/sections/lists/watchlist/WatchList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <WatchList
    title={m.list_title_watchlist_movies()}
    drilldownLabel={m.button_label_view_all_watchlist_movies()}
    type="movie"
    status="all"
  />

  <WatchList
    title={m.list_title_watchlist_shows()}
    drilldownLabel={m.button_label_view_all_watchlist_shows()}
    type="show"
    status="all"
  />

  <PersonalLists slug="me" type="personal" />
  <PersonalLists slug="me" type="liked" />
  <PersonalLists slug="me" type="collaboration" />

  <RenderFor audience="director">
    <SmartListRenderer type="movie" />
    <SmartListRenderer type="show" />
  </RenderFor>
</TraktPage>
