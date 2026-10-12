<script lang="ts" generics="T extends CalendarItemEntry">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getLocale } from "$lib/features/i18n";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
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
  import { dateKey } from "../../_internal/dateKey";
  import { useEpisodeType } from "../../useEpisodeType";
  import type { CalendarItem as CalendarItemEntry } from "../../_internal/useCalendar";
  import type { Snippet } from "svelte";
  import type { CalendarSource } from "../models/CalendarSource";
  import CalendarTitleActions from "../CalendarTitleActions.svelte";
  import CalendarBoardLayout from "./CalendarBoardLayout.svelte";
  import { getCalendarContext } from "../../context/getCalendarContext";
  import { useCalendarPeriod } from "../../context/useCalendarPeriod";
  import type { CalendarPeriod } from "../../models/CalendarLayoutProps";
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
    viewParam.setView(calendarView === "day" ? "week" : "day");
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

  const { calendar: monthCalendar } = $derived(
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
      variant="bar"
    />
    <CalendarWeekdayRow />
    <CalendarMonthGrid
      allDays={monthAllDays}
      activeDate={selectedDate}
      variant="mini"
      onSelectDay={jumpToDay}
    />
  </div>
{/snippet}

<div
  class="calendar-page-layout"
  class:is-docked={$isDocked}
  class:is-bar-pinned={isBarPinned}
  style:--calendar-bar-height="{barHeight}px"
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

      {#if !$isDocked}
        <div class="calendar-bar-dates">
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
              variant={isMonthOnly ? "fill" : "default"}
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

    &.is-bar-pinned {
      --calendar-sticky-top: calc(
        var(--calendar-bar-top) + var(--calendar-bar-height) -
          var(--border-thickness-xxs)
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

    background-color: var(--color-background);

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
      padding-bottom: var(--gap-xs);
    }

    .is-docked & {
      --page-top-offset: calc(var(--gap-m) + env(safe-area-inset-top, 0px));

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
      inset-inline: calc(-1 * var(--layout-distance-side));
      bottom: 100%;

      height: var(--calendar-bar-top);

      background-color: var(--color-background);
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
      border-radius: var(--ni-2);
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
