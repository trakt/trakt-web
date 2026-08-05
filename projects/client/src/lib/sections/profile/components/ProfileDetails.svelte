<script lang="ts">
  import Carousel from "$lib/components/carousel/Carousel.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ProfilePageBanner from "$lib/sections/profile-banner/ProfilePageBanner.svelte";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";
  import AllTimeStats from "./AllTimeStats.svelte";
  import MonthToDate from "./MonthToDate.svelte";
  import ThisMonth from "./ThisMonth.svelte";
  import ThisYear from "./ThisYear.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { isMe } = $derived(useIsMe(slug));

  const hasStats = $derived(profile.isVip || $isMe === true);
  const isFreeOtherProfile = $derived($isMe === false && !profile.isVip);
</script>

{#snippet thisMonth()}
  <ThisMonth {slug} />
{/snippet}

{#snippet allTimeStats()}
  {#if $isMe}
    <AllTimeStats />
  {:else}
    <ThisYear {slug} source="profile" />
  {/if}
{/snippet}

<div
  class="trakt-profile-details"
  class:has-stats={hasStats}
  class:is-narrow={isFreeOtherProfile}
>
  <ProfilePageBanner {profile} {slug} />

  {#if hasStats}
    <RenderFor audience="all" device={["desktop"]}>
      <div class="trakt-profile-details-item">
        {@render thisMonth()}
      </div>
      <div class="trakt-profile-details-item">
        {@render allTimeStats()}
      </div>
    </RenderFor>

    <RenderFor audience="all" device={["tablet-lg"]}>
      <Carousel items={[thisMonth, allTimeStats]} />
    </RenderFor>
  {/if}

  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    {#if hasStats}
      <MonthToDate {slug} />
    {/if}
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-details {
    --profile-details-gap: var(--gap-l);

    width: 100%;
    height: 100%;
    // Visible so the VIP avatar glow isn't clipped: the avatar sits flush in
    // the top-inline-start grid cell, so hidden overflow would cut the glow.
    overflow: visible;

    display: grid;
    // The banner column carries the whole identity block - avatar, name,
    // location, pills, about - while the stat columns only hold a couple of
    // figures each and have room to spare, so it gets the larger share rather
    // than an even third.
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--profile-details-gap);

    &.is-narrow {
      grid-template-columns: minmax(0, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);

      gap: var(--gap-s);
    }
  }

  .trakt-profile-details-item {
    position: relative;
    box-sizing: border-box;
    width: 100%;

    display: flex;
    justify-content: center;

    &::before {
      content: "";
      position: absolute;
      inset-inline-start: calc(-0.5 * var(--profile-details-gap));
      top: 0;
      bottom: 0;
      width: var(--ni-1);
      background: color-mix(in srgb, var(--color-border) 50%, transparent);
    }
  }
</style>
