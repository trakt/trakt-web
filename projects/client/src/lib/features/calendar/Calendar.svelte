<script lang="ts">
  import { goto } from "$app/navigation";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import FilterSidebar from "$lib/sections/navbar/components/filter/FilterSidebar.svelte";
  import { useNavbarState } from "$lib/sections/navbar/useNavbarState";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { LOCALE_MAP } from "$lib/utils/formatting/date/LOCALE_MAP.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { NOOP_FN } from "$lib/utils/constants.ts";
  import { differenceInDays } from "date-fns/differenceInDays";
  import { endOfMonth } from "date-fns/endOfMonth";
  import { endOfWeek } from "date-fns/endOfWeek";
  import { startOfMonth } from "date-fns/startOfMonth";
  import { startOfWeek as dfStartOfWeek } from "date-fns/startOfWeek";
  import { onMount } from "svelte";
  import { useFilter } from "../filters/useFilter";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarMonthGrid from "./_internal/CalendarMonthGrid.svelte";
  import CalendarWeekdayRow from "./_internal/CalendarWeekdayRow.svelte";
  import { dateKey } from "./_internal/dateKey";
  import {
    useCalendar,
    type CalendarItem as CalendarItemEntry,
  } from "./_internal/useCalendar";
  import CalendarItem from "./CalendarItem.svelte";
  import CalendarLayout from "./CalendarLayout.svelte";
  import { getCalendarContext } from "./context/getCalendarContext";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";
  import type { CalendarPeriod } from "./models/CalendarLayoutProps";
  import type { CalendarView } from "./models/CalendarView.ts";

  const order = "chronological" as const;

  const {
    startDate,
    endDate,
    next,
    previous,
    reset,
    loadMore,
    accumulate,
    activeDate,
  } = useCalendarPeriod();
  const { mode } = useDiscover();

  const days = $derived(getDaysDifference($startDate, $endDate));

  const { filterMap } = useFilter();

  const { isLoading, calendar } = $derived(
    useCalendar({
      start: $startDate,
      days,
      type: $mode,
      filter: $filterMap,
    }),
  );

  const periods: CalendarPeriod<CalendarItemEntry>[] = $derived(
    accumulate({
      calendar: $calendar,
      fingerprint: `${$mode}:${JSON.stringify($filterMap)}`,
    }),
  );

  const { visibleDate } = getCalendarContext();

  const selectedDate = $derived($visibleDate ?? $activeDate);

  const visiblePeriodCalendar = $derived.by(() => {
    const firstPeriod = periods.at(0)?.calendar ?? [];
    if (!$visibleDate) return firstPeriod;

    const scrollKey = dateKey($visibleDate);
    const match = periods.find((p) =>
      p.calendar.some((d) => dateKey(d.date) === scrollKey),
    );

    return match?.calendar ?? firstPeriod;
  });

  function handleNavigation(action: () => void) {
    action();
    document
      .getElementById(dateKey(activeDate.value))
      ?.scrollIntoView({ block: "start" });
  }

  const navigation = $derived({
    onNext: () => handleNavigation(next),
    onPrevious: () => handleNavigation(previous),
    onReset: () => handleNavigation(reset),
  });

  let calendarView = $state<CalendarView>("day");

  const toggleView = () => {
    calendarView = calendarView === "day" ? "week" : "day";
  };

  // Week view leans into upcoming content. Each `period` is one week, so
  // pulling three additional weeks via `loadMore()` lands the user on the
  // current week + the next three already populated. Past weeks remain
  // reachable through the chevrons or by scrolling up.
  const WEEK_VIEW_PRELOAD_TARGET = 4;

  $effect(() => {
    if (calendarView !== "week") return;
    if (periods.length >= WEEK_VIEW_PRELOAD_TARGET) return;
    if ($isLoading) return;
    loadMore();
  });

  // Month-wide calendar fetch — feeds the week-view month grid so every
  // day in the displayed month is coloured by has-items, not just the
  // weeks the day-view's infinite scroll has accumulated.
  const monthRange = $derived.by(() => {
    const locale = LOCALE_MAP[getLocale()] ?? LOCALE_MAP["en"];
    const reference = endOfWeek(selectedDate, { locale });
    const gridStart = dfStartOfWeek(startOfMonth(reference), { locale });
    const monthEnd = endOfMonth(reference);
    return {
      start: gridStart,
      days: differenceInDays(monthEnd, gridStart) + 1,
    };
  });

  const { calendar: monthCalendar } = $derived(
    useCalendar({
      start: monthRange.start,
      days: monthRange.days,
      type: $mode,
      filter: $filterMap,
    }),
  );

  const monthAllDays = $derived($monthCalendar ?? []);

  // Push the calendar navigation (Today / chevrons / Day-Week toggle +
  // day strip + month grid) into the FilterSidebar via navbar state so
  // the docked sidebar renders it at the top of its content — same hook
  // the overlay drawer uses elsewhere.
  const { set } = useNavbarState();

  $effect(() => {
    set({ filterPanelHeader: calendarNavigation });
  });

  onMount(() => {
    return () => set({ filterPanelHeader: null });
  });

  const closeToHome = () => goto(UrlBuilder.home());
</script>

{#snippet calendarNavigation()}
  <div class="calendar-filter-navigation" data-view={calendarView}>
    <CalendarHeader
      {navigation}
      activeDate={selectedDate}
      view={calendarView}
      onToggleView={toggleView}
    />
    <div class="calendar-filter-divider" aria-hidden="true"></div>
    <CalendarWeekdayRow />
    {#if calendarView === "day"}
      <CalendarDays
        calendar={visiblePeriodCalendar}
        {navigation}
        activeDate={selectedDate}
      />
    {:else}
      <CalendarMonthGrid
        allDays={monthAllDays}
        activeDate={selectedDate}
      />
    {/if}
    <button
      type="button"
      class="calendar-filter-expand"
      aria-label={calendarView === "week"
        ? m.button_label_collapse_calendar_month()
        : m.button_label_expand_calendar_month()}
      onclick={toggleView}
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path stroke="currentColor" stroke-width="2" d="m1.5 4.5 7 7 7-7" />
      </svg>
    </button>
  </div>
{/snippet}

<div class="calendar-page-layout" data-view={calendarView}>
  <div class="calendar-main">
    <CalendarLayout
      activeDate={$activeDate}
      isLoading={$isLoading}
      {navigation}
      onLoadMore={loadMore}
      {periods}
      {order}
      view={calendarView}
    >
      {#snippet item(media)}
        <CalendarItem item={media} variant="summary" />
      {/snippet}
    </CalendarLayout>
  </div>

  <FilterSidebar
    hasAutoClose={false}
    onClose={closeToHome}
    onSaveFilter={NOOP_FN}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-page-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ni-380);
    gap: var(--gap-l);

    margin: 0 var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }

  .calendar-main {
    min-width: 0;
  }

  /* The shared CalendarLayout adds its own page-side margin; zero it out
     inside the calendar page so the outer grid owns the layout edge. */
  .calendar-page-layout :global(.calendar-layout-container) {
    margin-left: 0;
    margin-right: 0;
  }

  /* The calendar-navigation block is the snippet pushed to the docked
     filter sidebar via navbar state; styles match the overlay flow. */
  .calendar-filter-navigation {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    width: 100%;
    padding: var(--ni-12) var(--ni-8);
    box-sizing: border-box;

    border: var(--border-thickness-xxs) solid var(--shade-800);
    border-radius: var(--border-radius-m);

    background-color: var(--shade-900);
  }

  .calendar-filter-divider {
    height: var(--border-thickness-xxs);
    width: 100%;

    background-color: var(--shade-800);
  }

  .calendar-filter-expand {
    all: unset;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-24);
    height: var(--ni-24);

    margin: 0 auto;

    color: var(--color-text-secondary);

    transition: var(--transition-increment) ease-in-out;
    transition-property: color, transform;

    -webkit-tap-highlight-color: transparent;

    svg {
      width: var(--ni-16);
      height: var(--ni-16);

      transition: transform var(--transition-increment) ease-in-out;
    }

    &:hover {
      color: var(--color-foreground);
    }

    &:focus-visible {
      outline: var(--border-thickness-xxs) solid var(--purple-400);
      border-radius: var(--ni-4);
    }
  }

  .calendar-filter-navigation[data-view="week"] .calendar-filter-expand svg {
    transform: rotate(180deg);
  }
</style>
