<script lang="ts">
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

<RecentlyWatchedList title="Recently Watched Episodes" type="episode" />
<RecentlyWatchedList title="Recently Watched Movies" type="movie" />
