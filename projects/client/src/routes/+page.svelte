<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextList from "$lib/sections/lists/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import SocialActivityList from "$lib/sections/lists/social/SocialActivityList.svelte";
  import ComingSoonList from "$lib/sections/lists/watchlist/ComingSoonList.svelte";
  import OutNowList from "$lib/sections/lists/watchlist/OutNowList.svelte";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.navbar_link_home()}
>
  <TraktPageCoverSetter />

  <RenderFor audience="authenticated">
    <ProfileBanner />
    <UpNextList />
    <OutNowList />
    <UpcomingList />
    <ComingSoonList />
    <SocialActivityList />
  </RenderFor>
  <RenderFor audience="public">
    <Landing />
  </RenderFor>
</TraktPage>
