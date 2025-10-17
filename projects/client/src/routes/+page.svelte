<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import MobileLanding from "$lib/sections/landing/MobileLanding.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ActivityList from "$lib/sections/lists/activity/ActivityList.svelte";
  import UpNextList from "$lib/sections/lists/progress/UpNextList.svelte";
  import StartWatchingList from "$lib/sections/lists/start-watching/StartWatchingList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import ReleasedList from "$lib/sections/lists/watchlist/ReleasedList.svelte";
  import MonthInReview from "$lib/sections/month-in-review/MonthInReview.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  // FIXME: ctas for these lists need to be reactive to useDiscover
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  type="home"
>
  <TraktPageCoverSetter />

  <RenderFor audience="authenticated">
    <MonthInReview />
    <UpNextList />
    <RenderForFeature flag={FeatureFlag.Discover}>
      {#snippet enabled()}
        <StartWatchingList />
      {/snippet}
      <ReleasedList />
    </RenderForFeature>
    <UpcomingList />
    <ActivityList />
  </RenderFor>

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
</TraktPage>
