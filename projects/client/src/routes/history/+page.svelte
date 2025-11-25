<script>
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PersonalHistoryPaginatedList from "$lib/sections/lists/history/PersonalHistoryPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { mode } = useDiscover();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_history()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <PersonalHistoryPaginatedList mode={$mode} />
</TraktPage>
