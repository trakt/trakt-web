<script lang="ts">
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import RecommendedMovies from "$lib/sections/recommendations/RecommendedMovies.svelte";
  import RecommendedShows from "$lib/sections/recommendations/RecommendedShows.svelte";
  import UpNext from "$lib/sections/up-next/UpNext.svelte";
  import UpcomingSchedule from "$lib/sections/upcoming-schedule/UpcomingSchedule.svelte";
</script>

<svelte:head>
  <title>Trakt Lite: Dashboard</title>
</svelte:head>

<div class="trakt-content">
  <ProfileBanner />
  <UpNext />
  <UpcomingSchedule />
  <RecommendedShows />
  <RecommendedMovies />
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
