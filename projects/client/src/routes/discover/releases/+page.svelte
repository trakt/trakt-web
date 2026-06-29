<script lang="ts">
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import ReleasesCalendar from "$lib/features/calendar/ReleasesCalendar.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";

  const { current } = useDiscover();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_releases()}
  info={{ overview: m.page_description_releases() }}
>
  <CalendarProvider>
    <NavbarStateSetter
      hasFilters
      header={{
        title: m.list_title_releases(),
        metaInfo: $current.text(),
      }}
    />

    <TraktPageCoverSetter />

    <ReleasesCalendar />
  </CalendarProvider>
</TraktPage>
