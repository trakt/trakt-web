<script>
  import { useUser } from "$lib/features/auth/stores/useUser";
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PersonalHistoryPaginatedList from "$lib/sections/lists/history/PersonalHistoryPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();
  const { history } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_history()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    hasFilters
    header={{ title: m.list_title_history(), metaInfo: $current.text() }}
  />

  {#if $history}
    <CalendarProvider initialDate={$history.lastWatchedAt}>
      <PersonalHistoryPaginatedList mode={$mode} />
    </CalendarProvider>
  {/if}
</TraktPage>
