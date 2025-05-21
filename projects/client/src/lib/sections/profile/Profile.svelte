<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FavoritesList from "../lists/FavoritesList.svelte";
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
    <RenderFor audience="all" navigation="default">
      <YearToDateLink isVip={profile.isVip} {slug} />
    </RenderFor>
  {/snippet}
</ProfileContainer>

<ProfileContainer>
  <ProfileHistorySummary movies={$historyMovies} shows={$historyShows} />
</ProfileContainer>

<FavoritesList
  type="movie"
  title={m.favorite_movies()}
  emptyMessage={m.favorite_movies_empty()}
/>
<FavoritesList
  type="show"
  title={m.favorite_shows()}
  emptyMessage={m.favorite_shows_empty()}
/>

<RecentlyWatchedList
  drilldownLabel={m.view_all_recently_watched()}
  title={m.recently_watched()}
  {slug}
/>

{#if slug !== "me"}
  <PersonalLists {slug} type="personal" variant="preview" />
  <PersonalLists {slug} type="collaboration" variant="summary" />
{/if}
