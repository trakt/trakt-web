<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextPaginatedList from "$lib/sections/lists/progress/UpNextPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { current } = useDiscover();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_up_next()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    hasFilters
    header={{ title: m.list_title_up_next(), metaInfo: $current.text() }}
  />

  <UpNextPaginatedList intent="continue" />
</TraktPage>
