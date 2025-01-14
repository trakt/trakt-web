<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RecentlyWatchedList from "../lists/RecentlyWatchedList.svelte";
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfileHistorySummary from "./components/ProfileHistorySummary.svelte";
  import YearToDateLink from "./components/YearToDateLink.svelte";
  import { useHistory } from "./stores/useHistory";

  const { historyMovies, historyShows } = useHistory();
</script>

<ProfileContainer>
  {#snippet details()}
    <ProfilePageBanner />
  {/snippet}

  <ProfileAbout />

  {#snippet contextualContent()}
    <YearToDateLink />
  {/snippet}
</ProfileContainer>

<ProfileContainer>
  <ProfileHistorySummary movies={$historyMovies} shows={$historyShows} />
</ProfileContainer>

<RecentlyWatchedList title={m.recently_watched_episodes()} type="episode" />
<RecentlyWatchedList title={m.recently_watched_movies()} type="movie" />
