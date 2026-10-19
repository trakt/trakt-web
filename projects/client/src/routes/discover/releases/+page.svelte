<script lang="ts">
  import CalendarNavbarState from "$lib/features/calendar/CalendarNavbarState.svelte";
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import ReleasesCalendar from "$lib/features/calendar/ReleasesCalendar.svelte";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_releases()}
  info={{ overview: m.page_description_releases() }}
>
  <CalendarProvider>
    <CalendarNavbarState title={m.list_title_releases()} />
    <TraktPageCoverSetter />
    <ReleasesCalendar />
  </CalendarProvider>
</TraktPage>
