<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
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

  const { isMe } = $derived(useIsMe(slug));
</script>

<ProfileContainer {profile} {slug}>
  <ProfileDetails {slug} {profile} />
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
