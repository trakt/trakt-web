<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import UpNextList from "$lib/sections/lists/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import ComingSoonList from "$lib/sections/lists/watchlist/ComingSoonList.svelte";
  import OutNowList from "$lib/sections/lists/watchlist/OutNowList.svelte";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import { DEFAULT_COVER, DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.navbar_link_home()}
>
  <RenderFor audience="authenticated">
    <CoverImageSetter src={current().cover.url} type="main" />
    <ProfileBanner />
    <UpNextList />
    <OutNowList title={m.out_now_title()} />
    <UpcomingList />
    <ComingSoonList title={m.coming_soon_title()} />
  </RenderFor>
  <RenderFor audience="public">
    <Landing />
    <CoverImageSetter src={DEFAULT_COVER} type="main" />
  </RenderFor>
</TraktPage>
