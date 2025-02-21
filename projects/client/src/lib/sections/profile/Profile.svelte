<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
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

<RecentlyWatchedList
  drilldownLabel={m.view_all_recently_watched()}
  title={m.recently_watched()}
/>

<PersonalLists type="personal" variant="preview" />
<PersonalLists type="collaboration" variant="summary" />
