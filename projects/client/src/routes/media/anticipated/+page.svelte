<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import AnticipatedPaginatedList from "$lib/sections/lists/anticipated/AnticipatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_anticipated_media()}
>
  <NavbarStateSetter hasFilters />
  <TraktPageCoverSetter />

  <AnticipatedPaginatedList
    title={m.list_title_most_anticipated()}
    type="media"
  />
</TraktPage>
