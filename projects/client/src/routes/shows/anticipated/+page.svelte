<script>
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import * as m from "$lib/features/i18n/messages";

  import AnticipatedPaginatedList from "$lib/sections/lists/anticipated/AnticipatedPaginatedList.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.anticipated_shows()}
>
  <AnticipatedPaginatedList title={m.anticipated_shows()} type="show" />
</TraktPage>
