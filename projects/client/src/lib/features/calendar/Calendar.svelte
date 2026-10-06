<script lang="ts">
  import { goto } from "$app/navigation";
  import { getLocale } from "$lib/features/i18n";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { LOCALE_MAP } from "$lib/utils/formatting/date/LOCALE_MAP.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { differenceInDays } from "date-fns/differenceInDays";
  import { endOfMonth } from "date-fns/endOfMonth";
  import { endOfWeek } from "date-fns/endOfWeek";
  import { startOfMonth } from "date-fns/startOfMonth";
  import { startOfWeek as dfStartOfWeek } from "date-fns/startOfWeek";
  import { tick } from "svelte";
  import { useFilter } from "../filters/useFilter";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarPosterTile from "./_internal/CalendarPosterTile.svelte";
  import CalendarSidebar from "./_internal/CalendarSidebar.svelte";
  import CalendarToolbar from "./_internal/CalendarToolbar.svelte";
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
  import EpisodeTypeToggles from "./EpisodeTypeToggles.svelte";
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

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  let chosenView = $state<CalendarView | null>(null);
  const calendarView = $derived<CalendarView>(
    chosenView ?? ($isDesktop ? "week" : "day"),
  );

  const toggleView = () => {
    chosenView = calendarView === "day" ? "week" : "day";
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

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);
  const isCompact = $derived($isMobile || $isTabletSmall);
  const layoutView = $derived(isCompact ? "day" : calendarView);
  const isBarPinned = $derived($isDesktop || calendarView === "day");

  let barHeight = $state(0);


  const closeToHome = () => goto(UrlBuilder.home());
</script>

{#snippet episodeTypeFilters()}
  <EpisodeTypeToggles />
{/snippet}

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

{#snippet miniMonth()}
  <div class="calendar-mini-month">
    <CalendarWeekdayRow />
    <CalendarMonthGrid
      allDays={monthAllDays}
      activeDate={selectedDate}
      variant="mini"
    />
  </div>
{/snippet}

<div
  class="calendar-page-layout"
  data-view={calendarView}
  class:is-docked={$isDesktop}
  class:is-bar-pinned={isBarPinned}
  style:--calendar-bar-height="{barHeight}px"
>
  <div class="calendar-main">
    <div class="calendar-bar" bind:offsetHeight={barHeight}>
      <CalendarToolbar
        {navigation}
        activeDate={selectedDate}
        actions={feedActions}
        filters={episodeTypeFilters}
        view={calendarView}
        onToggleView={toggleView}
      />

      {#if !$isDesktop}
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
            />
          {/if}
        </div>
      {/if}
    </div>

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
    <CalendarSidebar onClose={closeToHome}>
      {@render miniMonth()}
    </CalendarSidebar>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-page-layout {
    --calendar-bar-top: var(--navbar-height);
    --calendar-sticky-top: var(--calendar-bar-top);

    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--gap-xl);

    margin-inline: var(--layout-distance-side);

    @include for-tablet-sm-and-below {
      --calendar-bar-top: calc(
        var(--navbar-height) + env(safe-area-inset-top, 0px)
      );
    }

    &.is-docked {
      --calendar-bar-top: 0px;

      grid-template-columns: minmax(0, 1fr) var(--ni-380);
    }

    &.is-bar-pinned {
      @media (min-height: 500px) {
        --calendar-sticky-top: calc(
          var(--calendar-bar-top) + var(--calendar-bar-height)
        );
      }
    }
  }

  .calendar-main {
    display: flex;
    flex-direction: column;

    min-width: 0;
  }

  .calendar-page-layout :global(.trakt-calendar-layout) {
    margin-inline: 0;
  }

  .calendar-bar {
    position: relative;
    z-index: var(--layer-floating);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding-block: var(--gap-s) var(--gap-m);

    background-color: var(--color-background);

    .is-docked & {
      --page-top-offset: calc(var(--gap-m) + env(safe-area-inset-top, 0px));

      margin-top: calc(-1 * var(--page-top-offset));
      padding-top: calc(
        var(--page-top-offset) +
          (var(--side-navbar-actions-height) - var(--ni-48)) / 2
      );
    }

    .is-bar-pinned & {
      @media (min-height: 500px) {
        position: sticky;
        top: var(--calendar-bar-top);
      }
    }

    &::before {
      content: "";
      position: absolute;
      inset-inline: calc(-1 * var(--layout-distance-side));
      bottom: 100%;

      height: var(--calendar-bar-top);

      background-color: var(--color-background);
    }

    &::after {
      content: "";
      position: absolute;
      inset-inline: 0;
      top: 100%;

      height: var(--ni-16);

      background: linear-gradient(
        to bottom,
        var(--color-background),
        transparent
      );
      pointer-events: none;
    }

    .is-docked &::after {
      display: none;
    }

    :global(.calendar-month-poster) {
      width: 100%;
      height: 100%;
      min-height: 0;

      object-fit: cover;
      border-radius: var(--ni-2);
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
    gap: var(--gap-xs);

    padding: var(--ni-12);
    border-radius: var(--border-radius-xl);

    background-color: var(--color-calendar-background);
  }
</style>
