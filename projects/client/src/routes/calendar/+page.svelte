<script lang="ts">
  import Calendar from "$lib/features/calendar/Calendar.svelte";
  import CalendarNavbarState from "$lib/features/calendar/CalendarNavbarState.svelte";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_calendar()}
>
  <TraktPageCoverSetter />

  <CalendarNavbarState title={m.header_calendar()} hasFeed />
  <Calendar />
</TraktPage>
