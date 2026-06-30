<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import MonthInReviewLink from "$lib/sections/components/MonthInReviewLink.svelte";
  import ReviewContent from "$lib/sections/components/ReviewContent.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { useAllTimeStats } from "../stores/useAllTimeStats";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import WatchStats from "./_internal/WatchStats.svelte";
  import AllTimeLink from "./AllTimeLink.svelte";
  import SwipeCarousel from "./SwipeCarousel.svelte";
  import YearToDateLink from "./YearToDateLink.svelte";

  const source = "month-to-date";
  const { slug }: { slug: string } = $props();
  const mirDate = getPreviousMonth(new Date());

  const { isMe } = $derived(useIsMe(slug));
  const { monthToDate, isLoading } = $derived(useMonthToDate({ slug }));
  const { stats: allTimeStats, isLoading: isAllTimeLoading } =
    useAllTimeStats();

  let slideProgress = $state(0);
  let isDragging = $state(false);
  const slideMonthToDate = $derived(1 - slideProgress);
  const slideAllTime = $derived(slideProgress);
</script>

{#snippet headerContent()}
  {#if $isMe}
    <div class="trakt-mtd-header">
      <div class="trakt-mtd-title-stack">
        <div
          class="trakt-mtd-header-label"
          class:is-dragging={isDragging}
          style:opacity={slideMonthToDate}
        >
          <CalendarIcon />
          <span class="bold">{m.text_this_month()}</span>
        </div>
        <div
          class="trakt-mtd-header-label trakt-mtd-title-overlay"
          class:is-dragging={isDragging}
          style:opacity={slideAllTime}
        >
          <ClockIcon />
          <span class="bold">{m.text_all_time()}</span>
        </div>
      </div>
      <YearToDateLink {slug} {source} />
    </div>
  {:else}
    <div class="trakt-mtd-header-label">
      <CalendarIcon />
      <span class="bold uppercase">{m.text_this_month()}</span>
    </div>
    <YearToDateLink {slug} {source} />
  {/if}
{/snippet}

<div class="trakt-month-to-date">
  <ReviewContent coverSrc={$monthToDate.coverUrl}>
    {#snippet header()}
      {@render headerContent()}
    {/snippet}

    {#if $isMe}
      {#snippet monthToDateSlide()}
        <WatchStats stats={$monthToDate} isLoading={$isLoading} />
      {/snippet}
      {#snippet allTimeSlide()}
        <WatchStats stats={$allTimeStats} isLoading={$isAllTimeLoading} />
      {/snippet}
      <SwipeCarousel
        slides={[monthToDateSlide, allTimeSlide]}
        enabled={$isMe}
        onSlideProgress={(p) => (slideProgress = p)}
        onDragging={(d) => (isDragging = d)}
      />
    {:else}
      <WatchStats stats={$monthToDate} isLoading={$isLoading} />
    {/if}

    {#snippet footer()}
      <div
        class="trakt-mtd-footer"
        class:is-dragging={isDragging}
        style:opacity={$isMe ? slideMonthToDate : 1}
      >
        <MonthInReviewLink {slug} date={mirDate} {source} />
      </div>
      <RenderForFeature flag={FeatureFlag.YearInReview}>
        {#snippet enabled()}
          {#if $isMe}
            <div
              class="trakt-mtd-footer"
              class:is-dragging={isDragging}
              style:opacity={$isMe ? slideAllTime : 1}
            >
              <AllTimeLink {slug} {source} />
            </div>
          {/if}
        {/snippet}
      </RenderForFeature>
    {/snippet}
  </ReviewContent>
</div>

<style lang="scss">
  .trakt-mtd-header-label {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    transition: opacity 0.25s ease-in-out;

    &.is-dragging {
      transition: none;
    }
  }

  .trakt-mtd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: var(--gap-m);
  }

  .trakt-mtd-title-stack {
    position: relative;
  }

  .trakt-mtd-title-overlay {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
  }

  .trakt-mtd-footer {
    transition: opacity 0.25s ease-in-out;

    &.is-dragging {
      transition: none;
    }
  }
</style>
