<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { useFilter } from "../filters/useFilter";
  import {
    useCalendar,
    type CalendarItem as CalendarItemEntry,
  } from "./_internal/useCalendar";
  import CalendarDrawer from "./CalendarDrawer.svelte";
  import CalendarItem from "./CalendarItem.svelte";
  import CalendarLayout from "./CalendarLayout.svelte";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";

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

  const isCalendarDrawerOpen = writable(true);
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

  const periods = $derived<CalendarPeriod<CalendarItemEntry>[]>(
    accumulate({
      calendar: $calendar,
      fingerprint: `${$mode}:${JSON.stringify($filterMap)}`,
    }),
  );

  const visiblePeriodCalendar = $derived.by(() => {
    return periods.at(0)?.calendar ?? [];
  });

  const navigation = $derived({
    onNext: next,
    onPrevious: previous,
    onReset: reset,
  });
</script>

{#if $isCalendarDrawerOpen}
  <CalendarDrawer
    activeDate={$activeDate}
    calendar={visiblePeriodCalendar}
    {navigation}
    onClose={() => isCalendarDrawerOpen.set(false)}
  />
{/if}

<CalendarLayout
  activeDate={$activeDate}
  isLoading={$isLoading}
  {navigation}
  onLoadMore={loadMore}
  {periods}
  {order}
  showNavigation={false}
>
  {#snippet item(media)}
    <CalendarItem item={media} variant="summary" />
  {/snippet}
</CalendarLayout>
