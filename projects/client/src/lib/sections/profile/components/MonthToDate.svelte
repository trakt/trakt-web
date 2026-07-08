<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages";
  import MonthInReviewLink from "$lib/sections/components/MonthInReviewLink.svelte";
  import ReviewContent from "$lib/sections/components/ReviewContent.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { useAllTimeStats } from "../stores/useAllTimeStats";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import AllTimeStatsDrawerLink from "./_internal/AllTimeStatsDrawerLink.svelte";
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
      {#if $isMe}
        <div class="trakt-mtd-footer-stack">
          <div
            class="trakt-mtd-footer"
            class:is-dragging={isDragging}
            style:opacity={slideMonthToDate}
            style:pointer-events={slideMonthToDate === 0 ? "none" : "auto"}
          >
            <MonthInReviewLink {slug} date={mirDate} {source} />
          </div>
          <div
            class="trakt-mtd-footer"
            class:is-dragging={isDragging}
            style:opacity={slideAllTime}
            style:pointer-events={slideAllTime === 0 ? "none" : "auto"}
          >
            <AllTimeStatsDrawerLink variant="link" />
          </div>
        </div>

        <div
          class="trakt-mtd-footer"
          class:is-dragging={isDragging}
          style:opacity={slideAllTime}
          style:pointer-events={slideAllTime === 0 ? "none" : "auto"}
        >
          <AllTimeLink {slug} {source} />
        </div>
      {:else}
        <div class="trakt-mtd-footer">
          <MonthInReviewLink {slug} date={mirDate} {source} />
        </div>
      {/if}
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

  .trakt-mtd-footer-stack {
    display: grid;
    justify-items: start;

    > * {
      grid-area: 1 / 1;
    }
  }
</style>
