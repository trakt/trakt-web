<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { useFilter } from "../filters/useFilter";
  import {
    useCalendar,
    type CalendarItem as CalendarItemEntry,
  } from "./_internal/useCalendar";
  import CalendarItem from "./CalendarItem.svelte";
  import CalendarLayout from "./CalendarLayout.svelte";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";
  import type { CalendarPeriod } from "./models/CalendarLayoutProps";

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
</script>

<CalendarLayout
  activeDate={$activeDate}
  isLoading={$isLoading}
  onNext={next}
  onPrevious={previous}
  onReset={reset}
  onLoadMore={loadMore}
  {periods}
  {order}
>
  {#snippet item(media)}
    <CalendarItem item={media} variant="summary" />
  {/snippet}
</CalendarLayout>
