<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import PopularPaginatedList from "$lib/sections/lists/popular/PopularPaginatedList.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.popular_shows()}
>
  <TraktPageCoverSetter />

  <PopularPaginatedList title={m.popular_shows()} type="show" />
</TraktPage>
