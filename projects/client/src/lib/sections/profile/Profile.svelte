<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfileHistorySummary from "./components/ProfileHistorySummary.svelte";
  import YearToDateLink from "./components/YearToDateLink.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";
  import { useHistory } from "./stores/useHistory";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { historyMovies, historyShows } = $derived(useHistory(slug));
</script>

<ProfileContainer>
  {#snippet details()}
    <ProfilePageBanner {profile} {slug} />
  {/snippet}

  <ProfileAbout about={profile.about} />

  {#snippet contextualContent()}
    <YearToDateLink isVip={profile.isVip} {slug} />
  {/snippet}
</ProfileContainer>

<ProfileContainer>
  <ProfileHistorySummary movies={$historyMovies} shows={$historyShows} />
</ProfileContainer>

<RecentlyWatchedList
  drilldownLabel={m.view_all_recently_watched()}
  title={m.recently_watched()}
  {slug}
/>

<PersonalLists {slug} type="personal" variant="preview" />
<PersonalLists {slug} type="collaboration" variant="summary" />
