<script lang="ts" generics="T extends CalendarItemEntry">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getLocale } from "$lib/features/i18n";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { startOfMonth } from "date-fns/startOfMonth";
  import { addMonths } from "date-fns/addMonths";
  import { isBefore } from "date-fns/isBefore";
  import { tick, untrack } from "svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import CalendarDays from "./CalendarDays.svelte";
  import CalendarPosterTile from "./CalendarPosterTile.svelte";
  import CalendarSidebar from "./CalendarSidebar.svelte";
  import CalendarHeader from "./CalendarHeader.svelte";
  import CalendarDayDrawer from "./CalendarDayDrawer.svelte";
  import { useIsCalendarDocked } from "../useIsCalendarDocked";
  import CalendarToolbar from "./CalendarToolbar.svelte";
  import CalendarMonthGrid from "./CalendarMonthGrid.svelte";
  import { scrollToCalendarDay } from "./scrollToCalendarDay.ts";
  import { toMonthGridRange } from "./toMonthGridRange.ts";
  import { calendarViewParam } from "./calendarViewParam.ts";
  import CalendarWeekdayRow from "./CalendarWeekdayRow.svelte";
  import CalendarWeekHead from "./CalendarWeekHead.svelte";
  import { trackStuckWeekHead } from "./trackStuckWeekHead.ts";
  import { toWeekTimelineName } from "./toWeekTimelineName.ts";
  import { dateKey } from "./dateKey";
  import { useEpisodeType } from "../useEpisodeType";
  import type { CalendarItem as CalendarItemEntry } from "./useCalendar";
  import type { Snippet } from "svelte";
  import type { CalendarSource } from "../models/CalendarSource";
  import CalendarTitleActions from "../CalendarTitleActions.svelte";
  import CalendarBoardLayout from "./CalendarBoardLayout.svelte";
  import { getCalendarContext } from "../context/getCalendarContext";
  import { useCalendarPeriod } from "../context/useCalendarPeriod";
  import type { CalendarPeriod } from "../models/CalendarLayoutProps";
  import type { CalendarView } from "../models/CalendarView.ts";

  const {
    useSource,
    sourceKey,
    item,
    hasFeed = false,
  }: {
    useSource: CalendarSource<T>;
    sourceKey: string;
    item: Snippet<[T]>;
    hasFeed?: boolean;
  } = $props();

  const {
    startDate,
    endDate,
    next,
    previous,
    reset,
    loadMore,
    accumulate,
    activeDate,
    restart,
    goTo,
  } = useCalendarPeriod();
  const { mode } = useDiscover();

  const days = $derived(getDaysDifference($startDate, $endDate));

  const { filterMap } = useFilter();

  const { episodeType } = useEpisodeType();

  const { isLoading, calendar, hasUpstreamItems } = $derived(
    useSource({
      start: $startDate,
      days,
      type: $mode,
      filter: $filterMap,
      episodeType,
    }),
  );

  const fingerprint = $derived(
    `${sourceKey}:${$mode}:${JSON.stringify($filterMap)}:${$episodeType}`,
  );

  let previousFingerprint: string | undefined;

  $effect(() => {
    const current = fingerprint;
    const hasChanged = previousFingerprint !== undefined &&
      previousFingerprint !== current;
    previousFingerprint = current;

    if (hasChanged) untrack(restart);
  });

  const periods: CalendarPeriod<T>[] = $derived(
    accumulate({
      calendar: $calendar,
      fingerprint,
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

  const isDocked = useIsCalendarDocked();

  const viewParam = $derived(calendarViewParam(page.url.searchParams));
  const calendarView = $derived<CalendarView>(
    viewParam.view ?? ($isDocked ? "week" : "day"),
  );

  const toggleView = () => {
    const nextView = calendarView === "day" ? "week" : "day";
    viewParam.setView(nextView);

    if (isCompact && nextView === "week") window.scrollTo({ top: 0 });
  };

  const isCompact = $derived(!$isDocked);
  const layoutView = $derived(isCompact ? "day" : calendarView);
  const isMonthOnly = $derived(isCompact && calendarView === "week");

  const jumpToDay = ({ date }: { date: Date }) => {
    if (scrollToCalendarDay(date)) return;

    handleNavigation(() =>
      goTo(date, isBefore(date, selectedDate) ? "previous" : "next")
    );
  };

  const goToMonth = (offset: number) =>
    goTo(
      addMonths(startOfMonth(monthRange.reference), offset),
      offset > 0 ? "next" : "previous",
    );

  const navigation = $derived(
    isMonthOnly
      ? {
          onNext: () => goToMonth(1),
          onPrevious: () => goToMonth(-1),
          onReset: reset,
        }
      : {
          onNext: () => handleNavigation(next),
          onPrevious: () => handleNavigation(previous),
          onReset: () => handleNavigation(reset),
        },
  );

  const WEEK_VIEW_PRELOAD_TARGET = 4;

  $effect(() => {
    if (layoutView !== "week") return;
    if (periods.length >= WEEK_VIEW_PRELOAD_TARGET) return;
    if ($isLoading) return;
    loadMore();
  });

  const monthRange = $derived(toMonthGridRange(selectedDate, getLocale()));
  const monthStart = $derived(monthRange.start.getTime());
  const monthDays = $derived(monthRange.days);

  const { calendar: monthCalendar, isLoading: isMonthLoading } = $derived(
    useSource({
      start: new Date(monthStart),
      days: monthDays,
      type: $mode,
      filter: $filterMap,
      episodeType,
    }),
  );

  const monthAllDays = $derived($monthCalendar ?? []);

  let selectedDay = $state<{ date: Date; items: T[] } | null>(
    null,
  );
  const isBarPinned = $derived($isDocked || calendarView === "day");

  let barHeight = $state(0);
  let stuckWeekStart = $state<string | null>(null);

  const toWeekIndex = (start: string | null) =>
    periods.findIndex((period) => {
      const firstDay = period.calendar.at(0);
      return firstDay && dateKey(firstDay.date) === start;
    });

  const stuckWeekIndex = $derived(toWeekIndex(stuckWeekStart));
  const hasStuckWeek = $derived(stuckWeekIndex !== -1);
  const stuckWeek = $derived(
    hasStuckWeek ? periods.at(stuckWeekIndex)?.calendar : undefined,
  );
  const incomingWeek = $derived(
    hasStuckWeek ? periods.at(stuckWeekIndex + 1)?.calendar : undefined,
  );

  const setStuckWeek = (start: string | null) => {
    stuckWeekStart = start;
    if (layoutView !== "week") return;

    const index = toWeekIndex(start);
    const firstDay =
      index === -1 ? undefined : periods.at(index)?.calendar.at(0);
    visibleDate.next(firstDay?.date ?? null);
  };

  const toWeekStart = (period: CalendarPeriod<T> | undefined) => {
    const firstDay = period?.calendar.at(0);
    return firstDay ? dateKey(firstDay.date) : undefined;
  };

  const weekTimelines = $derived(
    periods
      .map(toWeekStart)
      .filter((start) => start !== undefined)
      .map(toWeekTimelineName)
      .join(", ") || "none",
  );
  const incomingTimeline = $derived.by(() => {
    const start = hasStuckWeek
      ? toWeekStart(periods.at(stuckWeekIndex + 1))
      : undefined;
    return start ? toWeekTimelineName(start) : undefined;
  });

  const closeToHome = () =>
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(UrlBuilder.home());
</script>

{#snippet episodeTypeFilters()}
  <CalendarTitleActions {hasFeed} />
{/snippet}

{#snippet summaryItem(media: T)}
  {@render item(media)}
{/snippet}

{#snippet posterItem(media: T)}
  <CalendarPosterTile item={media} />
{/snippet}

{#snippet monthPreview(items: T[])}
  {#each items as media (media.key)}
    <CrossOriginImage
      classList="calendar-month-poster"
      animate={false}
      src={"show" in media ? media.show.poster.url.thumb : media.poster.url.thumb}
      alt=""
    />
  {/each}
{/snippet}

{#snippet miniMonth()}
  <div class="calendar-mini-month">
    <CalendarHeader
      {navigation}
      activeDate={selectedDate}
      view={calendarView}
      onToggleView={toggleView}
    />
    <CalendarWeekdayRow />
    <CalendarMonthGrid
      allDays={monthAllDays}
      activeDate={selectedDate}
      variant="mini"
      isActiveWeekPinned
      onSelectDay={jumpToDay}
    />
  </div>
{/snippet}

<div
  class="calendar-page-layout"
  use:trackWindowScroll={"is-scrolled"}
  class:is-docked={$isDocked}
  class:is-bar-pinned={isBarPinned}
  class:has-stuck-week={layoutView === "week" && hasStuckWeek}
  style:--calendar-bar-height="{barHeight}px"
  style:timeline-scope={weekTimelines}
  use:trackStuckWeekHead={{ onChange: setStuckWeek }}
>
  <div class="calendar-main">
    <div
      class="calendar-bar"
      class:is-month-only={isMonthOnly}
      bind:offsetHeight={barHeight}
    >
      <CalendarToolbar
        {navigation}
        activeDate={selectedDate}
        titleDate={isMonthOnly ? monthRange.reference : selectedDate}
        filters={$isDocked ? episodeTypeFilters : undefined}
        hasControls={!$isDocked}
        view={calendarView}
        onToggleView={toggleView}
      />

      {#if layoutView === "week" && stuckWeek}
        <div class="calendar-bar-week">
          {#key `${weekTimelines}|${incomingTimeline}`}
            <div
              class="calendar-bar-week-slot"
              style:animation-timeline={incomingTimeline}
            >
              <CalendarWeekHead calendar={stuckWeek} />
              {#if incomingWeek}
                <CalendarWeekHead calendar={incomingWeek} />
              {/if}
            </div>
          {/key}
        </div>
      {/if}

      {#if !$isDocked}
        <div class="calendar-bar-dates">
          <CalendarWeekdayRow />
          {#if calendarView === "day"}
            <CalendarDays
              calendar={visiblePeriodCalendar}
              isLoading={$isLoading}
              {navigation}
              activeDate={selectedDate}
            />
          {:else}
            <CalendarMonthGrid
              allDays={monthAllDays}
              activeDate={selectedDate}
              preview={monthPreview}
              variant={isMonthOnly ? "fill" : "default"}
              isLoading={isMonthOnly && $isMonthLoading}
              onSelectDay={isMonthOnly
                ? (day) => (selectedDay = day)
                : jumpToDay}
            />
          {/if}
        </div>
      {/if}
    </div>

    {#if !isMonthOnly}
    <CalendarBoardLayout
      activeDate={$activeDate}
      isLoading={$isLoading}
      onLoadMore={loadMore}
      {periods}
      view={layoutView}
      item={layoutView === "week" ? posterItem : summaryItem}
    />
    {/if}
  </div>

  {#if $isDocked}
    <CalendarSidebar onClose={closeToHome}>
      {@render miniMonth()}
    </CalendarSidebar>
  {/if}
</div>

{#if selectedDay}
  <CalendarDayDrawer
    day={selectedDay}
    item={summaryItem}
    onClose={() => (selectedDay = null)}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes calendar-week-push {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(calc(-1 * var(--calendar-week-head-height)));
    }
  }

  .calendar-page-layout {
    --calendar-bar-top: var(--navbar-height);
    --calendar-sticky-top: var(--calendar-bar-top);

    display: grid;
    grid-template-columns: minmax(0, 1fr);

    margin-inline: var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      --calendar-bar-top: calc(
        var(--navbar-height) + env(safe-area-inset-top, 0px)
      );
    }

    &.is-docked {
      --calendar-bar-top: 0px;
      --drawer-width: var(--ni-320);

      grid-template-columns: minmax(0, 1fr) var(--drawer-width);
    }

    --calendar-bar-bottom: calc(
      var(--calendar-bar-top) + var(--calendar-bar-height)
    );

    &.is-bar-pinned {
      --calendar-sticky-top: calc(
        var(--calendar-bar-top) + var(--calendar-bar-height) -
          var(--border-thickness-xxs)
      );
    }

    &.has-stuck-week {
      --calendar-sticky-top: calc(
        var(--calendar-bar-top) + var(--calendar-bar-height) +
          var(--calendar-week-head-height)
      );
    }
  }

  .calendar-main {
    display: flex;
    flex-direction: column;

    min-width: 0;
  }

  .calendar-bar {
    position: relative;
    z-index: var(--layer-floating);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding-block: var(--gap-s) var(--gap-m);

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
      padding-bottom: var(--gap-xs);
    }

    .is-docked & {
      --page-top-offset: calc(var(--gap-m) + env(safe-area-inset-top, 0px));
      --calendar-card-top: calc(var(--page-top-offset) - var(--gap-s));
      --calendar-card-bottom: calc(
        var(--gap-m) - var(--gap-s) -
          (var(--side-navbar-actions-height) - var(--ni-48)) / 2
      );

      margin-top: calc(-1 * var(--page-top-offset));
      padding-top: calc(
        var(--page-top-offset) +
          (var(--side-navbar-actions-height) - var(--ni-48)) / 2
      );
    }

    .is-bar-pinned & {
      position: sticky;
      top: var(--calendar-bar-top);
    }

    &::before {
      content: "";
      position: absolute;
      z-index: -1;
      inset-inline: calc(-1 * var(--gap-s));
      inset-block: var(--calendar-card-top, var(--gap-xs))
        var(--calendar-card-bottom, 0px);

      .has-stuck-week & {
        inset-block-end: calc(-1 * var(--calendar-week-head-height));
      }

      border-radius: var(--border-radius-xl);

      transition:
        background-color var(--transition-duration-short) ease-out,
        box-shadow var(--transition-duration-short) ease-out,
        inset-block-end var(--transition-duration-short)
          cubic-bezier(0.22, 1, 0.36, 1);
    }

    .calendar-page-layout:not(.is-docked) & {
      padding-top: calc(var(--gap-s) + var(--gap-xs));
    }

    .calendar-page-layout.is-bar-pinned:global(.is-scrolled) &::before {
      background-color: var(--color-calendar-background);
      box-shadow: var(--shadow-raised);
      backdrop-filter: blur(var(--ni-16));
    }

    .calendar-page-layout.is-docked.is-bar-pinned:global(.is-scrolled)
      &::before {
      background-color: var(--color-background-navbar-base);
      backdrop-filter: none;
    }

    .calendar-bar-week {
      position: absolute;
      inset-inline: 0;
      top: 100%;

      overflow: hidden;
      height: var(--calendar-week-head-height);
    }

    .calendar-bar-week-slot {
      transform: translateY(calc(-1 * var(--calendar-week-push, 0px)));

      @supports (animation-timeline: view()) {
        animation: calendar-week-push linear both;
        animation-range: exit calc(-1 * var(--calendar-week-head-height)) exit
          0%;
      }
    }

    :global(.calendar-month-poster) {
      place-self: center;

      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      min-height: 0;
      aspect-ratio: 2 / 3;

      object-fit: cover;
      border-radius: var(--border-radius-xs);
    }
  }

  .calendar-bar.is-month-only {
    min-height: calc(100dvh - var(--calendar-bar-top) - var(--gap-m));

    @include for-mobile {
      min-height: calc(
        100dvh - var(--calendar-bar-top) - var(--mobile-navbar-height) -
          var(--gap-m)
      );
    }

    .calendar-bar-dates {
      flex: 1;
      min-height: 0;
    }
  }

  .calendar-bar-dates {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--ni-10) var(--ni-8);
    border-radius: var(--border-radius-xl);

    background-color: var(--color-calendar-background);
  }

  .calendar-mini-month {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-12);
    border-radius: var(--border-radius-xl);

    background-color: var(--color-calendar-background);
  }
</style>
