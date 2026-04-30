<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import FavoritesList from "../lists/favorites/FavoritesList.svelte";
  import PersonalHistoryList from "../lists/history/PersonalHistoryList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import LibraryList from "../lists/library/LibraryList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import MyActivityList from "./components/MyActivityList.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfileDetails from "./components/ProfileDetails.svelte";
  import ProfilesList from "./components/ProfilesList.svelte";
  import ProgressList from "./components/ProgressList.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps.ts";
  import ProfileDrawer from "./ProfileDrawer.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { mode } = useDiscover();

  const { isMe } = $derived(useIsMe(slug));
</script>

<ProfileContainer {profile} {slug}>
  <ProfileDetails {slug} {profile} />
</ProfileContainer>

{#if $isMe}
  <PersonalHistoryList mode={$mode} />
  <MyActivityList mode={$mode} />
  <ProgressList mode={$mode} />
{:else}
  <RecentlyWatchedList title={m.list_title_history()} {slug} mode={$mode} />
{/if}

<FavoritesList {slug} title={m.list_title_favorites()} mode={$mode} />

{#if !$isMe}
  <PersonalLists {slug} type="personal" mode={$mode} />
  <PersonalLists {slug} type="collaboration" mode={$mode} />
{/if}

<!-- FIXME: add library support to view other users libraries -->
{#if slug === "me"}
  <LibraryList mode={$mode} />
{/if}

<ProfilesList {slug} />

<ProfileDrawer />
