<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { recommendedMoviesQuery } from "$lib/requests/queries/recommendations/recommendedMoviesQuery";
  import { recommendedShowsQuery } from "$lib/requests/queries/recommendations/recommendedShowsQuery";
  import { addToWatchlistRequest } from "$lib/requests/sync/addToWatchlistRequest";
  import ProfileBanner from "$lib/sections/profile-banner/ProfileBanner.svelte";
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";
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
  <RecommendationList
    queryOptions={() => recommendedShowsQuery()}
    title={m.recommended_shows()}
    onAddToWatchlist={(id) =>
      addToWatchlistRequest({
        body: {
          shows: [{ ids: { trakt: id } }],
        },
      })}
  />
  <RecommendationList
    queryOptions={() => recommendedMoviesQuery()}
    title={m.recommended_movies()}
    onAddToWatchlist={(id) =>
      addToWatchlistRequest({
        body: {
          movies: [{ ids: { trakt: id } }],
        },
      })}
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
