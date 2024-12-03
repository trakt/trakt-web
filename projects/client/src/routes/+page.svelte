<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import RecommendedMovies from "$lib/sections/recommendations/RecommendedMovies.svelte";
  import RecommendedShows from "$lib/sections/recommendations/RecommendedShows.svelte";
  import UpNext from "$lib/sections/up-next/UpNext.svelte";
  import UpcomingSchedule from "$lib/sections/upcoming-schedule/UpcomingSchedule.svelte";
  import { ALIEN_ISOLATION_COVER } from "$lib/utils/constants";

  const { user } = useUser();
</script>

<svelte:head>
  <title>Trakt Lite: Dashboard</title>
</svelte:head>

<div class="trakt-content">
  <RenderFor audience="authenticated">
    <BackgroundCoverImage
      src={$user?.cover.url ?? ALIEN_ISOLATION_COVER}
      type="main"
    />
    <ProfileBanner />
    <UpNext />
    <UpcomingSchedule />
    <RecommendedShows />
    <RecommendedMovies />
  </RenderFor>
  <RenderFor audience="public">
    <BackgroundCoverImage src={ALIEN_ISOLATION_COVER} type="main" />
  </RenderFor>
</div>

<style>
  .trakt-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    inset: 0;
    margin: auto;
  }
</style>
