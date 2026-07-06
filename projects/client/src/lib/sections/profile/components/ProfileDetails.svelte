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
    --details-column-count: 3;
    --profile-details-gap: var(--gap-l);

    width: 100%;
    height: 100%;
    overflow: hidden;

    display: grid;
    grid-template-columns: repeat(var(--details-column-count), minmax(0, 1fr));
    gap: var(--profile-details-gap);

    &.is-narrow {
      --details-column-count: 1;
    }

    @include for-tablet-lg {
      --details-column-count: 2;
    }

    @include for-tablet-sm-and-below {
      --details-column-count: 1;

      overflow: visible;
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
