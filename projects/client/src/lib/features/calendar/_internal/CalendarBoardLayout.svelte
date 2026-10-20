<script lang="ts" generics="T extends { key: string }">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useLazyLoader } from "$lib/sections/lists/drilldown/_internal/useLazyLoader";
  import { dateKey } from "./dateKey";
  import EmptyPeriod from "./EmptyPeriod.svelte";
  import ScrollSpy from "./ScrollSpy.svelte";
  import { getCalendarContext } from "../context/getCalendarContext";
  import type { CalendarBoardLayoutProps } from "../models/CalendarBoardLayoutProps";
  import CalendarItems from "./CalendarItems.svelte";
  import CalendarWeekItems from "./CalendarWeekItems.svelte";

  const {
    activeDate,
    isLoading,
    item,
    layout = "grid",
    order = "chronological",
    view = "day",
    periods,
    onLoadMore,
  }: CalendarBoardLayoutProps<T> = $props();

  const { visibleDate } = getCalendarContext();

  const allDays = $derived(periods.flatMap((p) => p.calendar));
  const isEmpty = $derived(allDays.every((day) => day.items.length === 0));

  function handleScrollSpyUpdate(id: string) {
    if (view === "week") return;

    const entry = allDays.find((d) => dateKey(d.date) === id);
    if (!entry) return;
    visibleDate.next(entry.date);
  }

  const loadMore = () => {
    if (isLoading) return;
    onLoadMore();
  };

  const { observeDimension } = useLazyLoader({ loadMore, parent: null });

  const isInitialPeriod = $derived(periods.length <= 1);
  const isInitialLoad = $derived(isInitialPeriod && isLoading);
</script>

<div class="trakt-calendar-board-layout" use:observeDimension>
  {#if isInitialLoad}
    <div class="loading-wrapper">
      <LoadingIndicator size="large" />
    </div>
  {:else}
    <ScrollSpy
      selector=".calendar-day-anchor"
      initialId={dateKey(activeDate)}
      skipVisible={view === "week"}
      onUpdate={handleScrollSpyUpdate}
    >
      {#each periods as period (period.key)}
        {#if view === "week"}
          <CalendarWeekItems calendar={period.calendar} {item} />
        {:else if period.calendar.some((day) => day.items.length > 0)}
          <CalendarItems calendar={period.calendar} {order} {item} {layout} />
        {/if}
      {/each}

      {#if view !== "week" && isEmpty && !isLoading}
        <EmptyPeriod />
      {/if}
    </ScrollSpy>

    {#if isLoading}
      <div class="loading-wrapper">
        <LoadingIndicator size="small" />
      </div>
    {/if}
  {/if}
</div>

<style>
  .trakt-calendar-board-layout {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    flex-grow: 1;
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
    padding: var(--gap-l);
  }
</style>
