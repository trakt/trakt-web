<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import Banner from "$lib/sections/banner/Banner.svelte";
  import DashboardDrawer from "$lib/sections/dashboard/DashboardDrawer.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import MobileLanding from "$lib/sections/landing/MobileLanding.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ActivityList from "$lib/sections/lists/activity/ActivityList.svelte";
  import PersonalHistoryList from "$lib/sections/lists/history/PersonalHistoryList.svelte";
  import UpNextList from "$lib/sections/lists/progress/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import StreakCallout from "$lib/sections/stats/StreakCallout.svelte";
  import WeeklyPulse from "$lib/sections/stats/WeeklyPulse.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  // FIXME: move to PersonalHistoryList when Profile also supports discover mode
  const { mode } = useDiscover();
  const { isAuthorized } = useAuth();
  const audience = $derived($isAuthorized ? "authenticated" : "public");
  const pageMode = $derived($isAuthorized ? "default" : "content-only");
</script>

<TraktPage
  {audience}
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  type="home"
  mode={pageMode}
>
  <RenderFor audience="authenticated">
    <TraktPageCoverSetter />

    <NavbarStateSetter hasFilters>
      {#snippet actions()}
        <DiscoverToggles />
      {/snippet}
    </NavbarStateSetter>

    <Banner />
    <UpNextList intent="continue" />

    <RenderForFeature flag={FeatureFlag.ThisWeek}>
      {#snippet enabled()}
        <WeeklyPulse />
      {/snippet}
    </RenderForFeature>

    <UpNextList intent="start" />
    <StreakCallout />
    <UpcomingList />
    <PersonalHistoryList mode={$mode} />
    <ActivityList />

    <DashboardDrawer />
  </RenderFor>

  <RenderFor audience="public">
    <NavbarStateSetter mode="hidden" />

    <RenderFor audience="public" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <Landing />
    </RenderFor>

    <RenderFor audience="public" device={["mobile"]}>
      <MobileLanding />
    </RenderFor>
  </RenderFor>
</TraktPage>
