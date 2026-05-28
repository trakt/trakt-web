<script lang="ts">
  import CalendarLayout from "$lib/features/calendar/CalendarLayout.svelte";
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { HISTORY_UPPER_LIMIT } from "$lib/utils/constants";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode }: { mode?: DiscoverMode } = $props();

  const order = "reverse-chronological" as const;

  const { activeDate } = useCalendarPeriod({ order });

  const historyType = $derived(toRecentlyWatchedType(mode));

  const { filterMap } = useFilter();

  const now = new Date();

  // We go for a somewhat stable end date to not invalidate the query on every page visit
  const endDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  const { periods, isLoading, hasNextPage, fetchNextPage } = $derived(
    useRecentlyWatchedList({
      type: historyType,
      slug: "me",
      limit: HISTORY_UPPER_LIMIT,
      filter: $filterMap,
      endDate,
    }),
  );

  const loadMore = $derived(() => {
    if (!$hasNextPage) return;
    fetchNextPage();
  });

  // FIXME: add support for prev/next/reset to this paginated variant
</script>

<CalendarLayout
  activeDate={$activeDate}
  isLoading={$isLoading}
  onLoadMore={loadMore}
  periods={$periods}
  layout="list"
  maxDate={now}
  {order}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</CalendarLayout>
