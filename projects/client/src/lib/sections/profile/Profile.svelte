<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import FavoritesList from "../lists/FavoritesList.svelte";
  import PersonalHistoryList from "../lists/history/PersonalHistoryList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import LibraryList from "../lists/library/LibraryList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ProfilePageBanner from "../profile-banner/ProfilePageBanner.svelte";
  import MonthToDate from "./components/MonthToDate.svelte";
  import ProfileAbout from "./components/ProfileAbout.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfilesList from "./components/ProfilesList.svelte";
  import VipUpsell from "./components/VipUpsell.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { isMe } = $derived(useIsMe(slug));

  const hasUpsell = $derived($isMe && !profile.isVip);
</script>

<ProfileContainer {profile} {slug}>
  <ProfilePageBanner {profile} {slug} />

  <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
    <ProfileAbout {profile} {slug} />
  </RenderFor>

  {#snippet details()}
    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <p>Desktop version of stats</p>
    </RenderFor>

    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      {#if profile.isVip}
        <MonthToDate {slug} />
      {/if}

      {#if hasUpsell}
        <VipUpsell />
      {/if}

      <ProfileAbout {profile} {slug} />
    </RenderFor>
  {/snippet}
</ProfileContainer>

{#if $isMe}
  <PersonalHistoryList />
{:else}
  <RecentlyWatchedList title={m.list_title_history()} {slug} />
{/if}

<FavoritesList {slug} title={m.list_title_favorites()} />

{#if !$isMe}
  <PersonalLists {slug} type="personal" />
  <PersonalLists {slug} type="collaboration" />
{/if}

<!-- FIXME: add library support to view other users libraries -->
{#if slug === "me"}
  <LibraryList />
{/if}

<ProfilesList {slug} />
