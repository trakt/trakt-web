<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import MobileLanding from "$lib/sections/landing/MobileLanding.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ActivityList from "$lib/sections/lists/activity/ActivityList.svelte";
  import UpNextList from "$lib/sections/lists/progress/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import MonthInReview from "$lib/sections/month-in-review/MonthInReview.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  type="home"
>
  <TraktPageCoverSetter />

  <NavbarStateSetter>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <MonthInReview />
  <UpNextList intent="continue" />
  <UpNextList intent="start" />
  <UpcomingList />
  <ActivityList activityType="personal" />
  <ActivityList activityType="social" />
</TraktPage>

<RenderFor audience="public">
  <RenderFor
    audience="public"
    navigation="default"
    device={["tablet-sm", "tablet-lg", "desktop"]}
  >
    <Landing />
  </RenderFor>

  <RenderFor audience="public" navigation="default" device={["mobile"]}>
    <MobileLanding />
  </RenderFor>

  <RenderFor audience="public" navigation="dpad">
    <Redirect to={UrlBuilder.login.activate()} />
  </RenderFor>
</RenderFor>
