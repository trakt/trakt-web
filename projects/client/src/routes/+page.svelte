<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextList from "$lib/sections/lists/progress/UpNextList.svelte";
  import SocialActivityList from "$lib/sections/lists/social/SocialActivityList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import ReleasedList from "$lib/sections/lists/watchlist/ReleasedList.svelte";
  import UnreleasedList from "$lib/sections/lists/watchlist/UnreleasedList.svelte";
  import MonthInReview from "$lib/sections/month-in-review/MonthInReview.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
>
  <TraktPageCoverSetter />

  <RenderFor audience="authenticated">
    <MonthInReview />
    <UpNextList />
    <ReleasedList />
    <UpcomingList />
    <UnreleasedList />
    <SocialActivityList />
  </RenderFor>
  <RenderFor audience="public" navigation="default">
    <Landing />
  </RenderFor>
  <RenderFor audience="public" navigation="dpad">
    <Redirect to={UrlBuilder.login.activate()} />
  </RenderFor>
</TraktPage>
