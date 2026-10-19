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
  import { getLocale } from "$lib/features/i18n";
  import { getStartOfWeek } from "$lib/utils/date/getStartOfWeek.ts";
  import { isCurrentWeek } from "$lib/utils/date/isCurrentWeek.ts";
  import { loadAboveViewport } from "./loadAboveViewport.ts";
  import { afterNavigate } from "$app/navigation";

  const {
    activeDate,
    isLoading,
    item,
    layout = "grid",
    order = "chronological",
    view = "day",
    periods,
    onLoadMore,
    isInitialLoad,
    isLoadingAbove,
    onLoadPrevious,
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

  const scrollTargetId = $derived(
    view === "week"
      ? `week-${dateKey(getStartOfWeek(activeDate, getLocale()))}`
      : dateKey(activeDate),
  );

  afterNavigate(({ type }) => {
    if (type !== "popstate") return;

    document.getElementById(scrollTargetId)?.scrollIntoView({ block: "start" });
  });

  const isActiveWeekCurrent = $derived(isCurrentWeek(activeDate, getLocale()));

  const topEdge = $derived({
    firstKey: periods.at(0)?.key,
    lastKey: periods.at(-1)?.key,
    canLoad: !isInitialLoad && !isLoadingAbove,
    isArmed: !isActiveWeekCurrent,
    onLoad: onLoadPrevious,
  });
</script>

<div
  class="trakt-calendar-board-layout"
  use:observeDimension
  use:loadAboveViewport={topEdge}
>
  {#if isInitialLoad}
    <div class="loading-wrapper">
      <LoadingIndicator size="large" />
    </div>
  {:else}
    <ScrollSpy
      selector=".calendar-day-anchor"
      initialId={scrollTargetId}
      skipVisible={view === "week" && isActiveWeekCurrent}
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
    overflow-anchor: none;

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
