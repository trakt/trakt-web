<script lang="ts">
  import Calendar from "$lib/features/calendar/Calendar.svelte";
  import { useEpisodeType } from "$lib/features/calendar/useEpisodeType";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import CalendarTitleActions from "$lib/features/calendar/CalendarTitleActions.svelte";
  import { useIsCalendarDocked } from "$lib/features/calendar/useIsCalendarDocked";

  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { current } = useDiscover();
  const { current: episodeType, isApplicable } = useEpisodeType();
  const isDocked = useIsCalendarDocked();
</script>

{#snippet episodeTypeToggles()}
  <CalendarTitleActions />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_calendar()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    mode={$isDocked ? "minimal" : "full"}
    hasFilters
    showFilters={!$isDocked}
    header={{
      title: m.header_calendar(),
      metaInfo: $isApplicable ? $episodeType.text() : $current.text(),
      actions: $isDocked ? undefined : episodeTypeToggles,
    }}
  />

  <Calendar />
</TraktPage>
