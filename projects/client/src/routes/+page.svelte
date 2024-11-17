<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { recommendMovies } from "$lib/requests/recommendations/recommendMovies";
  import { recommendShows } from "$lib/requests/recommendations/recommendShows";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";
  import UpNext from "$lib/sections/up-next/UpNext.svelte";
  import UpcomingSchedule from "$lib/sections/upcoming-schedule/UpcomingSchedule.svelte";
</script>

<div class="trakt-content">
  <ProfileBanner />
  <UpNext />
  <UpcomingSchedule />
  <RecommendationList
    dataSourceFactory={recommendShows}
    title={m.recommended_shows()}
  />
  <RecommendationList
    dataSourceFactory={recommendMovies}
    title={m.recommended_movies()}
  />
</div>

<style>
  .trakt-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    inset: 0;
    margin: auto;
  }
</style>
