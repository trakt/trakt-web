<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import Banner from "$lib/sections/banner/Banner.svelte";
  import DashboardDrawer from "$lib/sections/dashboard/DashboardDrawer.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ActivityList from "$lib/sections/lists/activity/ActivityList.svelte";
  import PersonalHistoryList from "$lib/sections/lists/history/PersonalHistoryList.svelte";
  import UpNextList from "$lib/sections/lists/progress/UpNextList.svelte";
  import RecommendedList from "$lib/sections/lists/recommended/RecommendedList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import WatchList from "$lib/sections/lists/watchlist/WatchList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import StreakCallout from "$lib/sections/stats/StreakCallout.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  // FIXME: move to PersonalHistoryList when Profile also supports discover mode
  const { mode } = useDiscover();

  const recommendedDrilldownLabel = $derived(
    $mode === "show"
      ? m.button_label_view_all_recommended_shows()
      : m.button_label_view_all_recommended_movies(),
  );
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  filterScope="global"
>
  <TraktPageCoverSetter />

  <NavbarStateSetter contentToggle="discover" hasFilters />

  <Banner />
  <UpNextList />

  <WatchList
    drilldownLabel={m.button_label_view_all_start_watching_items()}
    type={$mode}
    intent="start"
  />

  <StreakCallout />
  <UpcomingList />
  <RecommendedList
    title={m.list_title_recommended()}
    drilldownLabel={recommendedDrilldownLabel}
    type={$mode}
  />
  <PersonalHistoryList mode={$mode} />
  <ActivityList />

  <DashboardDrawer />
</TraktPage>
