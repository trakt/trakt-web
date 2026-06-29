<script lang="ts">
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useActivityList } from "$lib/sections/lists/activity/_internal/useActivityList";

  import ActivityPaginatedList from "$lib/sections/lists/activity/ActivityPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();

  const { list, isLoading } = $derived(
    useActivityList({
      type: $mode,
      limit: 1,
    }),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social_activity()}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_social_activity(),
      metaInfo: $current.text(),
    }}
  />

  {#if !$isLoading}
    <CalendarProvider initialDate={$list.at(0)?.activityAt}>
      <ActivityPaginatedList />
    </CalendarProvider>
  {/if}
</TraktPage>
