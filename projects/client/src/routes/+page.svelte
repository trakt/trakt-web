<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import UpNext from "$lib/sections/up-next/UpNext.svelte";
  import UpcomingSchedule from "$lib/sections/upcoming-schedule/UpcomingSchedule.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage title={m.navbar_link_home()}>
  <RenderFor audience="authenticated">
    <BackgroundCoverImage src={current().cover.url} type="main" />
    <ProfileBanner />
    <UpNext />
    <UpcomingSchedule />
  </RenderFor>
  <RenderFor audience="public">
    <Landing />
    <BackgroundCoverImage src={DEFAULT_COVER} type="main" />
  </RenderFor>
</TraktPage>
