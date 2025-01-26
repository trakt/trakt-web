<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";

  import RecommendedPaginatedList from "$lib/sections/lists/recommended/RecommendedPaginatedList.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.recommended_shows()}
>
  <RecommendedPaginatedList title={m.recommended_shows()} type="show" />
</TraktPage>
