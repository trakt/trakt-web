<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FavoritesList from "../lists/FavoritesList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import MonthToDate from "./components/MonthToDate.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import VipUpsell from "./components/VipUpsell.svelte";
  import YearToDateLink from "./components/YearToDateLink.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { user } = useUser();
  const isMe = $derived(slug === "me" || slug === $user.slug);
  const hasUpsell = $derived(isMe && !profile.isVip);
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
  {#if profile.isVip}
    <MonthToDate {slug} />
  {/if}

  {#if hasUpsell}
    <VipUpsell />
  {/if}
</ProfileContainer>

<FavoritesList
  {slug}
  type="movie"
  title={m.favorite_movies()}
  emptyMessage={m.favorite_movies_empty()}
/>

<FavoritesList
  {slug}
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
  <PersonalLists {slug} type="personal" />
  <PersonalLists {slug} type="collaboration" />
{/if}
