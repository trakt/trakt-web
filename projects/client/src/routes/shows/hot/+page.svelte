<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import HotPaginatedList from "$lib/sections/lists/hot/HotPaginatedList.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_hot_shows()}
>
  <TraktPageCoverSetter />

  <HotPaginatedList title={m.list_title_hot_shows()} type="show" />
</TraktPage>
