<script lang="ts" generics="T extends { key: string }">
  import { getLocale } from "$lib/features/i18n";
  import { trackElementBottom } from "$lib/utils/actions/trackElementBottom";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { getStartOfWeek } from "$lib/utils/date/getStartOfWeek.ts";
  import { untrack } from "svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import CalendarChunkSources from "./_internal/CalendarChunkSources.svelte";
  import { dateKey } from "./_internal/dateKey";
  import { useCalendarBoard } from "./_internal/useCalendarBoard.ts";
  import { getCalendarContext } from "./context/getCalendarContext";
  import type { HistoryCalendarProps } from "./models/HistoryCalendarProps";
  import CalendarBoardLayout from "./_internal/CalendarBoardLayout.svelte";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarWeekdayRow from "./_internal/CalendarWeekdayRow.svelte";

  const {
    useSource,
    sourceKey,
    item,
    layout = "list",
    maxDate,
    minDate,
  }: HistoryCalendarProps<T> = $props();

  const order = "reverse-chronological" as const;
  const WEEKS_PER_STEP = 4;
  const EMPTY_WEEK_LIMIT = 52;

  const { board, sources, register, activeDate, loadMore, loadPrevious } =
    useCalendarBoard<T>({
      order,
      weeksPerStep: WEEKS_PER_STEP,
      upperBound: getStartOfWeek(new Date(), getLocale()),
      lowerBound: untrack(() => minDate) ?? undefined,
      emptyWeekLimit: EMPTY_WEEK_LIMIT,
      fingerprint: fromRune(() => sourceKey),
    });

  const periods = $derived($board.periods);

  const { visibleDate } = getCalendarContext();

  const selectedDate = $derived($visibleDate ?? $activeDate);

  const visiblePeriodCalendar = $derived.by(() => {
    const firstPeriod = periods.at(0)?.calendar ?? [];
    if (!$visibleDate) return firstPeriod;

    const scrollKey = dateKey($visibleDate);
    const match = periods.find((period) =>
      period.calendar.some((day) => dateKey(day.date) === scrollKey),
    );

    return match?.calendar ?? firstPeriod;
  });
</script>

<div class="trakt-history-calendar">
  <div
    class="history-calendar-navigation"
    use:trackWindowScroll={"is-scrolled"}
    use:trackElementBottom={"--calendar-sticky-top"}
  >
    <div class="history-calendar-dates">
      <CalendarWeekdayRow />
      <CalendarDays
        calendar={visiblePeriodCalendar}
        isLoading={$board.isInitialLoad}
        {maxDate}
        activeDate={selectedDate}
      />
    </div>
  </div>

  <CalendarChunkSources
    sources={$sources}
    load={(chunk) => useSource({ start: chunk.start, days: chunk.days })}
    {register}
  />

  <CalendarBoardLayout
    activeDate={$activeDate}
    isLoading={$board.isLoadingBelow}
    isInitialLoad={$board.isInitialLoad}
    isLoadingAbove={$board.isLoadingAbove}
    onLoadMore={loadMore}
    onLoadPrevious={loadPrevious}
    {periods}
    {order}
    {layout}
    {item}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-history-calendar {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    margin-inline: var(--layout-distance-side);
  }

  .history-calendar-navigation {
    --sticky-top: var(--navbar-actions-bottom, env(safe-area-inset-top, 0px));

    position: sticky;
    top: var(--sticky-top);
    z-index: var(--layer-overlay);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    overflow: hidden;

    max-width: var(--ni-480);
    padding: var(--ni-10);
    border-radius: var(--border-radius-m);

    background-color: var(--color-calendar-background);
    box-shadow: var(--shadow-raised);
    backdrop-filter: blur(var(--ni-8));

    transition: var(--transition-increment) ease-in-out;
    transition-property: gap, top;

    :global(.trakt-calendar-header) {
      align-self: flex-end;
    }

    @include for-mobile {
      --sticky-top: calc(env(safe-area-inset-top, 0px) + var(--ni-4));

      :global(.trakt-calendar-header) {
        transition: height var(--transition-increment) ease-in-out;
      }

      &:global(.is-scrolled) {
        gap: var(--ni-0);

        :global(.trakt-calendar-header) {
          height: var(--ni-0);
        }
      }
    }

    @include for-tablet-sm-and-below {
      top: calc(var(--navbar-height) + var(--sticky-top));
    }
  }

  .history-calendar-dates {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
