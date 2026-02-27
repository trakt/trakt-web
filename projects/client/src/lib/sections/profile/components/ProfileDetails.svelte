<script lang="ts">
  import Carousel from "$lib/components/carousel/Carousel.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ProfilePageBanner from "$lib/sections/profile-banner/ProfilePageBanner.svelte";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";
  import MonthToDate from "./MonthToDate.svelte";
  import ProfileAbout from "./ProfileAbout.svelte";
  import ThisMonth from "./ThisMonth.svelte";
  import ThisYear from "./ThisYear.svelte";
  import VipUpsell from "./VipUpsell.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { isMe } = $derived(useIsMe(slug));

  const hasUpsell = $derived($isMe && !profile.isVip);
  const isFreeOtherProfile = $derived(!$isMe && !profile.isVip);
</script>

{#snippet thisMonth()}
  <ThisMonth {slug} />
{/snippet}

{#snippet thisYear()}
  <ThisYear {slug} source="profile" />
{/snippet}

<div
  class="trakt-profile-details"
  class:is-vip={profile.isVip}
  class:is-narrow={isFreeOtherProfile}
>
  <div class="trakt-profile-banner">
    <ProfilePageBanner {profile} {slug} />

    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <ProfileAbout {profile} {slug} />
    </RenderFor>
  </div>

  {#if profile.isVip}
    <RenderFor audience="all" device={["desktop"]}>
      <div class="trakt-profile-details-item">
        {@render thisMonth()}
      </div>
      <div class="trakt-profile-details-item">
        {@render thisYear()}
      </div>
    </RenderFor>

    <RenderFor audience="all" device={["tablet-lg"]}>
      <Carousel items={[thisMonth, thisYear]} />
    </RenderFor>
  {/if}

  <RenderFor audience="free" device={["desktop", "tablet-lg"]}>
    {#if hasUpsell}
      <div class="trakt-profile-details-item">
        <VipUpsell />
      </div>
    {/if}
  </RenderFor>

  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    {#if profile.isVip}
      <MonthToDate {slug} />
    {/if}

    <RenderFor audience="free">
      {#if hasUpsell}
        <VipUpsell />
      {/if}
    </RenderFor>

    <ProfileAbout {profile} {slug} />
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
    grid-template-columns: repeat(var(--details-column-count), 1fr);
    gap: var(--profile-details-gap);

    &:not(.is-vip) {
      --details-column-count: 2;

      .trakt-profile-details-item {
        &::before {
          display: none;
        }
      }
    }

    &.is-narrow {
      --details-column-count: 1;
    }

    @include for-tablet-lg {
      --details-column-count: 2;
    }

    @include for-tablet-sm-and-below {
      overflow: visible;
      gap: var(--gap-s);

      &:not(.is-vip),
      & {
        --details-column-count: 1;
      }
    }
  }

  .trakt-profile-banner {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--gap-m);
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
      left: calc(-0.5 * var(--profile-details-gap));
      top: 0;
      bottom: 0;
      width: var(--ni-1);
      background: color-mix(in srgb, var(--color-border) 50%, transparent);
    }
  }
</style>
