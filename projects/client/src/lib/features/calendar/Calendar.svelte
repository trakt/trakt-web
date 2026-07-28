<script lang="ts">
  import { FilterKey } from "$lib/features/filters/models/Filter";
  import { toMultiSelectSelection } from "$lib/features/filters/toMultiSelectSelection";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import { map } from "rxjs";
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

  const { filterMap, getFilterValue } = useFilter();

  // Kept out of `$derived` so a selection change narrows the entries already
  // in hand instead of rebuilding the query chain.
  const episodeTypeValue = getFilterValue(FilterKey.EpisodeTypes);
  const episodeTypes = episodeTypeValue.pipe(map(toMultiSelectSelection));

  const { isLoading, calendar } = $derived(
    useCalendar({
      start: $startDate,
      days,
      type: $mode,
      filter: $filterMap,
      episodeTypes,
    }),
  );

  const periods: CalendarPeriod<CalendarItemEntry>[] = $derived(
    accumulate({
      calendar: $calendar,
      fingerprint: `${$mode}:${JSON.stringify($filterMap)}:${
        $episodeTypeValue ?? ""
      }`,
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
    <CalendarItem item={media} variant="summary" />
  {/snippet}
</CalendarLayout>
