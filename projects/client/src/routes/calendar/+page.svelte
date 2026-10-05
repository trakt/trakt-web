<script lang="ts">
  import Calendar from "$lib/features/calendar/Calendar.svelte";
  import EpisodeTypeToggles from "$lib/features/calendar/EpisodeTypeToggles.svelte";
  import { useEpisodeType } from "$lib/features/calendar/useEpisodeType";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";

  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { current } = useDiscover();
  const { current: episodeType, isApplicable } = useEpisodeType();
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
</script>

{#snippet episodeTypeToggles()}
  <EpisodeTypeToggles />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_calendar()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    contentToggle="discover"
    hasFilters
    showFilters={!$isDesktop}
    header={{
      title: m.header_calendar(),
      metaInfo: $isApplicable ? $episodeType.text() : $current.text(),
      actions: episodeTypeToggles,
    }}
  />

  <Calendar />
</TraktPage>
