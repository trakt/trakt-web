<script lang="ts">
  import CalendarLayout from "$lib/features/calendar/CalendarLayout.svelte";
  import HistoryCalendar from "$lib/features/calendar/v2/HistoryCalendar.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { HISTORY_UPPER_LIMIT } from "$lib/utils/constants";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode, syncId }: { mode?: DiscoverMode; syncId?: number } = $props();

  const order = "reverse-chronological" as const;

  const { activeDate } = useCalendarPeriod({ order });

  const historyType = $derived(toRecentlyWatchedType(mode));

  const { filterMap } = useFilter();

  const { periods, isLoading, hasNextPage, fetchNextPage } = $derived(
    useRecentlyWatchedList({
      type: historyType,
      slug: "me",
      limit: HISTORY_UPPER_LIMIT,
      filter: $filterMap,
      syncId,
    }),
  );

  const loadMore = $derived(() => {
    if (!$hasNextPage) return;
    fetchNextPage();
  });

  const now = new Date();

  // FIXME: add support for prev/next/reset to this paginated variant

  const { isEnabled } = useFeatureFlag();
  const isRedesign = isEnabled(FeatureFlag.CalendarRedesign);
  const Layout = $derived($isRedesign ? HistoryCalendar : CalendarLayout);
</script>

<Layout
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
</Layout>
