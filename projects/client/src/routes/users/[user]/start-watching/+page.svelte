<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextPaginatedList from "$lib/sections/lists/progress/UpNextPaginatedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_start_watching()}
>
  <TraktPageCoverSetter />

  <UpNextPaginatedList intent="start" />
</TraktPage>
