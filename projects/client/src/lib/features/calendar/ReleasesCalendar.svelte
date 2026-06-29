<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import type { ReleasesCalendarEntry } from "$lib/requests/queries/calendars/releasesCalendarQuery";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { useFilter } from "../filters/useFilter";
  import { useReleasesCalendar } from "./_internal/useReleasesCalendar";
  import CalendarLayout from "./CalendarLayout.svelte";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";
  import type { CalendarPeriod } from "./models/CalendarLayoutProps";
  import ReleasesCalendarItem from "./ReleasesCalendarItem.svelte";

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
  const { filterMap } = useFilter();

  const days = $derived(getDaysDifference($startDate, $endDate));

  const { isLoading, calendar } = $derived(
    useReleasesCalendar({
      start: $startDate,
      days,
      type: $mode,
      filter: $filterMap,
    }),
  );

  const periods: CalendarPeriod<ReleasesCalendarEntry>[] = $derived(
    accumulate({
      calendar: $calendar,
      fingerprint: `releases:${$mode}:${JSON.stringify($filterMap)}`,
    }),
  );

  const navigation = $derived({
    onNext: next,
    onPrevious: previous,
    onReset: reset,
  });
</script>

<CalendarLayout
  activeDate={$activeDate}
  isLoading={$isLoading}
  {navigation}
  onLoadMore={loadMore}
  {periods}
  {order}
>
  {#snippet item(media)}
    <ReleasesCalendarItem item={media} variant="summary" />
  {/snippet}
</CalendarLayout>
