<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FavoritesList from "../lists/FavoritesList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import LibraryList from "../lists/library/LibraryList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import MonthToDate from "./components/MonthToDate.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfilesList from "./components/ProfilesList.svelte";
  import VipUpsell from "./components/VipUpsell.svelte";
  import YearToDateLink from "./components/YearToDateLink.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

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

<RecentlyWatchedList
  drilldownLabel={m.button_label_view_all_recently_watched()}
  title={m.list_title_recently_watched()}
  {slug}
/>

<FavoritesList {slug} title={m.list_title_favorites()} />

{#if slug !== "me"}
  <PersonalLists {slug} type="personal" />
  <PersonalLists {slug} type="collaboration" />
{/if}

<!-- FIXME: add library support to view other users libraries -->
{#if slug === "me"}
  <LibraryList />
{/if}

<ProfilesList {slug} />
