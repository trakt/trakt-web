<script lang="ts">
  import { goto } from "$app/navigation";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import FilterSidebar from "$lib/sections/navbar/components/filter/FilterSidebar.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useNavbarState } from "$lib/sections/navbar/useNavbarState";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { trackElementBottom } from "$lib/utils/actions/trackElementBottom";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { LOCALE_MAP } from "$lib/utils/formatting/date/LOCALE_MAP.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { NOOP_FN } from "$lib/utils/constants.ts";
  import { differenceInDays } from "date-fns/differenceInDays";
  import { endOfMonth } from "date-fns/endOfMonth";
  import { endOfWeek } from "date-fns/endOfWeek";
  import { startOfMonth } from "date-fns/startOfMonth";
  import { startOfWeek as dfStartOfWeek } from "date-fns/startOfWeek";
  import { tick } from "svelte";
  import { useFilter } from "../filters/useFilter";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarPosterTile from "./_internal/CalendarPosterTile.svelte";
  import CalendarMonthGrid from "./_internal/CalendarMonthGrid.svelte";
  import CalendarWeekdayRow from "./_internal/CalendarWeekdayRow.svelte";
  import { dateKey } from "./_internal/dateKey";
  import { useEpisodeType } from "./useEpisodeType";
  import {
    useCalendar,
    type CalendarItem as CalendarItemEntry,
  } from "./_internal/useCalendar";
  import CalendarFeedMenu from "./CalendarFeedMenu.svelte";
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

  const { episodeType } = useEpisodeType();

  const { isLoading, calendar, hasUpstreamItems } = $derived(
    useCalendar({
      start: $startDate,
      days,
      type: $mode,
      filter: $filterMap,
      episodeType,
    }),
  );

  const periods: CalendarPeriod<CalendarItemEntry>[] = $derived(
    accumulate({
      calendar: $calendar,
      fingerprint: `${$mode}:${JSON.stringify($filterMap)}:${$episodeType}`,
      isEmpty: !$hasUpstreamItems,
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

  async function handleNavigation(action: () => void) {
    action();
    await tick();
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

  const WEEK_VIEW_PRELOAD_TARGET = 4;

  $effect(() => {
    if (calendarView !== "week") return;
    if (periods.length >= WEEK_VIEW_PRELOAD_TARGET) return;
    if ($isLoading) return;
    loadMore();
  });

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
      episodeType,
    }),
  );

  const monthAllDays = $derived($monthCalendar ?? []);

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);
  const isCompact = $derived($isMobile || $isTabletSmall);
  const layoutView = $derived(isCompact ? "day" : calendarView);

  const { set } = useNavbarState();

  $effect(() => {
    set({ filterPanelHeader: $isDesktop ? calendarNavigation : null });
    return () => set({ filterPanelHeader: null });
  });

  const closeToHome = () => goto(UrlBuilder.home());
</script>

{#snippet feedActions()}
  <CalendarFeedMenu />
{/snippet}

{#snippet summaryItem(media: CalendarItemEntry)}
  <CalendarItem item={media} variant="summary" />
{/snippet}

{#snippet posterItem(media: CalendarItemEntry)}
  <CalendarPosterTile item={media} />
{/snippet}

{#snippet monthPreview(items: CalendarItemEntry[])}
  {#each items as media (media.key)}
    <CrossOriginImage
      classList="calendar-month-poster"
      animate={false}
      src={"show" in media ? media.show.poster.url.thumb : media.poster.url.thumb}
      alt=""
    />
  {/each}
{/snippet}

{#snippet calendarNavigation()}
  <div class="calendar-filter-navigation" data-view={calendarView}>
    <CalendarHeader
      {navigation}
      activeDate={selectedDate}
      actions={feedActions}
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
        preview={monthPreview}
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

<div
  class="calendar-page-layout"
  data-view={calendarView}
  class:is-docked={$isDesktop}
>
  <div class="calendar-main">
    {#if !$isDesktop}
      <div
        class="calendar-pinned-navigation"
        use:trackWindowScroll={"is-scrolled"}
        use:trackElementBottom={"--calendar-nav-bottom"}
      >
        {@render calendarNavigation()}
      </div>
    {/if}
    <CalendarLayout
      activeDate={$activeDate}
      isLoading={$isLoading}
      onLoadMore={loadMore}
      {periods}
      {order}
      view={layoutView}
      hasNavigationBar={false}
      item={layoutView === "week" ? posterItem : summaryItem}
    />
  </div>

  {#if $isDesktop}
    <FilterSidebar
      hasAutoClose={false}
      onClose={closeToHome}
      onSaveFilter={NOOP_FN}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-page-layout {
    --calendar-sticky-top: var(--navbar-height);

    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--gap-l);

    margin-inline: var(--layout-distance-side);

    &.is-docked {
      grid-template-columns: minmax(0, 1fr) var(--ni-380);
    }

    &:not(.is-docked) {
      --calendar-sticky-top: var(--calendar-nav-bottom, var(--navbar-height));
    }
  }

  .calendar-main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    min-width: 0;
  }

  .calendar-page-layout :global(.trakt-calendar-layout) {
    margin-inline: 0;
  }

  .calendar-pinned-navigation {
    position: sticky;
    top: var(--navbar-actions-bottom, var(--navbar-height));
    z-index: var(--layer-overlay);

    @include for-tablet-sm-and-below {
      top: calc(var(--navbar-height) + env(safe-area-inset-top, 0px));
    }

    .calendar-page-layout[data-view="week"] & {
      position: relative;
    }

    :global(.trakt-calendar-header),
    .calendar-filter-divider,
    .calendar-filter-expand {
      transition: var(--transition-increment) ease-in-out;
      transition-property: height, opacity, margin;
    }

    &:global(.is-scrolled) {
      :global(.trakt-calendar-header),
      .calendar-filter-divider,
      .calendar-filter-expand {
        height: 0;
        margin-block: calc(-1 * var(--gap-s) / 2);
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
      }
    }
  }

  .calendar-filter-navigation {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    width: 100%;
    padding: var(--ni-12);
    box-sizing: border-box;

    border-radius: var(--border-radius-xl);
    background-color: var(--color-calendar-background);
    box-shadow: var(--shadow-raised);
    backdrop-filter: blur(var(--ni-16));

    :global(.calendar-month-poster) {
      width: 100%;
      height: 100%;
      min-height: 0;

      object-fit: cover;
      border-radius: var(--ni-2);
    }
  }

  .calendar-filter-divider {
    height: var(--border-thickness-xxs);
    width: 100%;

    background-color: var(--color-calendar-active-background);
  }

  .calendar-filter-expand {
    all: unset;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-24);
    height: var(--ni-24);
    margin-inline: auto;

    color: var(--color-text-secondary);

    -webkit-tap-highlight-color: transparent;

    svg {
      width: var(--ni-16);
      height: var(--ni-16);

      transition: transform var(--transition-increment) ease-in-out;
    }

    @include for-mouse {
      &:hover {
        color: var(--color-foreground);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xxs) solid var(--color-link-active);
      border-radius: var(--ni-4);
    }
  }

  .calendar-filter-navigation[data-view="week"] .calendar-filter-expand svg {
    transform: rotate(180deg);
  }
</style>
