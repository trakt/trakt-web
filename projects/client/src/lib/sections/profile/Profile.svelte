<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages";
  import FavoritesList from "../lists/FavoritesList.svelte";
  import PersonalHistoryList from "../lists/history/PersonalHistoryList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import LibraryList from "../lists/library/LibraryList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfileDetails from "./components/ProfileDetails.svelte";
  import ProfilesList from "./components/ProfilesList.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { mode } = useDiscover();

  const { isMe } = $derived(useIsMe(slug));
</script>

<ProfileContainer {profile} {slug}>
  <ProfileDetails {slug} {profile} />
</ProfileContainer>

{#if $isMe}
  <PersonalHistoryList mode={$mode} />
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
