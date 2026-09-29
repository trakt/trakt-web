<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import { useVipVeteran } from "$lib/features/vip-veteran/stores/useVipVeteran.ts";
  import { useVipVeteranMoments } from "$lib/features/vip-veteran/stores/useVipVeteranMoments.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import FavoritesList from "../lists/favorites/FavoritesList.svelte";
  import PersonalHistoryList from "../lists/history/PersonalHistoryList.svelte";
  import RecentlyWatchedList from "../lists/history/RecentlyWatchedList.svelte";
  import LibraryList from "../lists/library/LibraryList.svelte";
  import PersonalLists from "../lists/user/PersonalLists.svelte";
  import ScreenTime from "../stats/ScreenTime.svelte";
  import MyActivityList from "./components/MyActivityList.svelte";
  import ProfileContainer from "./components/ProfileContainer.svelte";
  import ProfileDetails from "./components/ProfileDetails.svelte";
  import ProfilesList from "./components/ProfilesList.svelte";
  import ProgressList from "./components/ProgressList.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps.ts";
  import ProfileDrawer from "./ProfileDrawer.svelte";
  import VipStreakAnniversaryDialog from "./vip-streak/VipStreakAnniversaryDialog.svelte";
  import VipStreakGraceBanner from "./vip-streak/VipStreakGraceBanner.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { mode } = useDiscover();

  const { isMe } = $derived(useIsMe(slug));

  const { veteran } = useVipVeteran(fromRune(() => slug));
  const { celebration, graceDaysLeft } = useVipVeteranMoments({
    veteran,
    isMe: fromRune(() => $isMe),
  });
  const promotion = $derived(
    $celebration?.kind === "promotion" ? $celebration : null,
  );
  let isAnniversaryDismissed = $state(false);
</script>

{#if $veteran && $graceDaysLeft != null}
  <VipStreakGraceBanner years={$veteran.years} daysLeft={$graceDaysLeft} />
{/if}

<ProfileContainer {profile} {slug}>
  <ProfileDetails {slug} {profile} {promotion} />
</ProfileContainer>

<FavoritesList {slug} title={m.list_title_favorites()} mode={$mode} />

{#if $isMe}
  <ScreenTime />
  <PersonalHistoryList mode={$mode} />
  <MyActivityList mode={$mode} />
  <ProgressList mode={$mode} />
{:else}
  <RecentlyWatchedList title={m.list_title_history()} {slug} mode={$mode} />
{/if}

{#if !$isMe}
  <PersonalLists {slug} type="personal" mode={$mode} />
  <PersonalLists {slug} type="collaboration" mode={$mode} />
{/if}

<!-- FIXME: add library support to view other users libraries -->
{#if slug === "me"}
  <LibraryList mode={$mode} />
{/if}

<ProfilesList {slug} />

<ProfileDrawer {slug} {profile} />

{#if $veteran && $celebration?.kind === "anniversary" && !isAnniversaryDismissed}
  <VipStreakAnniversaryDialog
    veteran={$veteran}
    onClose={() => (isAnniversaryDismissed = true)}
  />
{/if}
