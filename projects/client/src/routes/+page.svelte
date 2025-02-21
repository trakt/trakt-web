<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import UpNextList from "$lib/sections/lists/UpNextList.svelte";
  import UpcomingList from "$lib/sections/lists/UpcomingList.svelte";
  import SocialActivityList from "$lib/sections/lists/social/SocialActivityList.svelte";
  import ReleasedList from "$lib/sections/lists/watchlist/ReleasedList.svelte";
  import UnreleasedList from "$lib/sections/lists/watchlist/UnreleasedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.navbar_link_home()}
>
  <TraktPageCoverSetter />

  <RenderFor audience="authenticated">
    <UpNextList />
    <ReleasedList />
    <UpcomingList />
    <UnreleasedList />
    <SocialActivityList />
  </RenderFor>
  <RenderFor audience="public">
    <Landing />
  </RenderFor>
</TraktPage>
