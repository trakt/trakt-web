<script lang="ts">
  import CalendarLayout from "$lib/features/calendar/CalendarLayout.svelte";
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod";
  import type { CalendarPeriod } from "$lib/features/calendar/models/CalendarLayoutProps";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { HISTORY_UPPER_LIMIT } from "$lib/utils/constants";
  import type { HistoryEntry } from "../stores/models/HistoryEntry";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode }: { mode?: DiscoverMode } = $props();

  const order = "reverse-chronological" as const;

  const {
    startDate,
    endDate,
    activeDate,
    next,
    previous,
    reset,
    loadMore,
    accumulate,
  } = useCalendarPeriod({ order });

  const historyType = $derived(toRecentlyWatchedType(mode));

  const { filterMap } = useFilter();

  const { historyCalendar, isLoading } = $derived(
    useRecentlyWatchedList({
      type: historyType,
      slug: "me",
      range: {
        startDate: $startDate,
        endDate: $endDate,
      },
      limit: HISTORY_UPPER_LIMIT,
      filter: $filterMap,
    }),
  );

  const periods: CalendarPeriod<HistoryEntry>[] = $derived(
    accumulate({
      calendar: $historyCalendar,
      fingerprint: `${historyType}:${JSON.stringify($filterMap)}`,
    }),
  );

  const now = new Date();
</script>

<CalendarLayout
  activeDate={$activeDate}
  isLoading={$isLoading}
  onNext={next}
  onPrevious={previous}
  onReset={reset}
  onLoadMore={loadMore}
  {periods}
  layout="list"
  maxDate={now}
  {order}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</CalendarLayout>
