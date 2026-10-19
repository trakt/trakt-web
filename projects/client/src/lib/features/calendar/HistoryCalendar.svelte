<script lang="ts" generics="T extends { key: string }">
  import { trackElementBottom } from "$lib/utils/actions/trackElementBottom";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";
  import { tick } from "svelte";
  import { dateKey } from "./_internal/dateKey";
  import { getCalendarContext } from "./context/getCalendarContext";
  import type { CalendarLayoutProps } from "./models/CalendarLayoutProps";
  import CalendarBoardLayout from "./_internal/CalendarBoardLayout.svelte";
  import CalendarDays from "./_internal/CalendarDays.svelte";
  import CalendarHeader from "./_internal/CalendarHeader.svelte";
  import CalendarWeekdayRow from "./_internal/CalendarWeekdayRow.svelte";

  const {
    activeDate,
    isLoading,
    navigation: externalNavigation,
    item,
    layout = "list",
    maxDate,
    order = "chronological",
    periods,
    onLoadMore,
  }: CalendarLayoutProps<T> = $props();

  const { visibleDate } = getCalendarContext();

  const selectedDate = $derived($visibleDate ?? activeDate);

  const visiblePeriodCalendar = $derived.by(() => {
    const firstPeriod = periods.at(0)?.calendar ?? [];
    if (!$visibleDate) return firstPeriod;

    const scrollKey = dateKey($visibleDate);
    const match = periods.find((period) =>
      period.calendar.some((day) => dateKey(day.date) === scrollKey)
    );

    return match?.calendar ?? firstPeriod;
  });

  async function handleNavigation(action: () => void) {
    visibleDate.next(null);
    action();
    await tick();
    document
      .getElementById(dateKey(activeDate))
      ?.scrollIntoView({ block: "start" });
  }

  const navigation = $derived.by(() => {
    if (!externalNavigation) return;

    return {
      onNext: () => handleNavigation(externalNavigation.onNext),
      onPrevious: () => handleNavigation(externalNavigation.onPrevious),
      onReset: () => handleNavigation(externalNavigation.onReset),
    };
  });
</script>

<div class="trakt-history-calendar">
  <div
    class="history-calendar-navigation"
    use:trackWindowScroll={"is-scrolled"}
    use:trackElementBottom={"--calendar-sticky-top"}
  >
    {#if navigation}
      <CalendarHeader
        {navigation}
        {maxDate}
        activeDate={selectedDate}
      />
    {/if}
    <div class="history-calendar-dates">
      <CalendarWeekdayRow />
      <CalendarDays
        calendar={visiblePeriodCalendar}
        {isLoading}
        {navigation}
        {maxDate}
        activeDate={selectedDate}
      />
    </div>
  </div>

  <CalendarBoardLayout
    {activeDate}
    {isLoading}
    {onLoadMore}
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
