<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import FavoritesList from "../lists/FavoritesList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import MonthToDate from "./components/MonthToDate.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfilesList from "./components/ProfilesList.svelte";
  import VipUpsell from "./components/VipUpsell.svelte";
  import YearToDateLink from "./components/YearToDateLink.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";
  import { useFollowing } from "./stores/useFollowing";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { following, followers } = $derived(useFollowing(slug));
  const { isMe } = $derived(useIsMe(slug));

  const hasUpsell = $derived($isMe && !profile.isVip);
</script>

<ProfileContainer>
  {#snippet details()}
    <ProfilePageBanner {profile} {slug} />
  {/snippet}

  <RenderFor audience="all" navigation="default">
    <YearToDateLink isVip={profile.isVip} {slug} />
  </RenderFor>

  {#if profile.isVip}
    <MonthToDate {slug} />
  {/if}

  {#if hasUpsell}
    <VipUpsell />
  {/if}

  <ProfileAbout about={profile.about} />
</ProfileContainer>

{#if !$isMe}
  <RecentlyWatchedList
    drilldownLabel={m.button_label_view_all_recently_watched()}
    title={m.list_title_recently_watched()}
    {slug}
  />
{/if}

<FavoritesList
  {slug}
  type="movie"
  title={m.list_title_favorite_movies()}
  emptyMessage={m.list_placeholder_favorite_movies()}
/>

<FavoritesList
  {slug}
  type="show"
  title={m.list_title_favorite_shows()}
  emptyMessage={m.list_placeholder_favorite_shows()}
/>

{#if slug !== "me"}
  <PersonalLists {slug} type="personal" />
  <PersonalLists {slug} type="collaboration" />
{/if}

<RenderForFeature flag={FeatureFlag.SocialNetwork}>
  {#snippet enabled()}
    <ProfilesList {slug} type="following" profiles={$following} />
    <ProfilesList {slug} type="followers" profiles={$followers} />
  {/snippet}
</RenderForFeature>
