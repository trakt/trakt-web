<script lang="ts">
  import Carousel from "$lib/components/carousel/Carousel.svelte";
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
  import ThisMonth from "./components/ThisMonth.svelte";
  import VipUpsell from "./components/VipUpsell.svelte";
  import YearToDateLink from "./components/YearToDateLink.svelte";
  import type { DisplayableProfileProps } from "./DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { isMe } = $derived(useIsMe(slug));

  // const hasUpsell = $derived($isMe && !profile.isVip);
  const hasUpsell = $derived($isMe);
</script>

{#snippet slide1()}
  <ThisMonth {slug} />
{/snippet}

{#snippet slide2()}
  <YearToDateLink {slug} source="profile" />
{/snippet}

{#snippet details()}
  <RenderFor audience="vip" device={["desktop", "tablet-lg"]}>
    <div class="trakt-profile-details-container">
      <RenderFor audience="all" device={["desktop"]}>
        <div class="trakt-profile-details">
          {@render slide1()}
          {@render slide2()}
        </div>
      </RenderFor>
      <RenderFor audience="all" device={["tablet-lg"]}>
        <Carousel items={[slide1, slide2]} />
      </RenderFor>
    </div>
  </RenderFor>

  <RenderFor audience="vip" device={["mobile", "tablet-sm"]}>
    {#if profile.isVip}
      <MonthToDate {slug} />
    {/if}

    <ProfileAbout {profile} {slug} />
  </RenderFor>

  <RenderFor audience="free">
    {#if hasUpsell}
      <VipUpsell />
    {/if}
  </RenderFor>
{/snippet}

<ProfileContainer
  {profile}
  {slug}
  details={profile.isVip || hasUpsell ? details : undefined}
>
  <ProfilePageBanner {profile} {slug} />

  <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
    <ProfileAbout {profile} {slug} />
  </RenderFor>
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

<style lang="scss">
  .trakt-profile-details-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .trakt-profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-m);
    justify-items: center;
  }
</style>
