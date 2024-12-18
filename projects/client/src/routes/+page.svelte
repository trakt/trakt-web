<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import ComingSoonList from "$lib/sections/lists/ComingSoonList.svelte";
  import OutNowList from "$lib/sections/lists/OutNowList.svelte";
  import UpNextList from "$lib/sections/lists/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage title={m.navbar_link_home()}>
  <RenderFor audience="authenticated">
    <BackgroundCoverImage src={current().cover.url} type="main" />
    <ProfileBanner />
    <UpNextList />
    <OutNowList title={m.out_now_title()} />
    <UpcomingList />
    <ComingSoonList title={m.coming_soon_title()} />
  </RenderFor>
  <RenderFor audience="public">
    <Landing />
    <BackgroundCoverImage src={DEFAULT_COVER} type="main" />
  </RenderFor>
</TraktPage>
