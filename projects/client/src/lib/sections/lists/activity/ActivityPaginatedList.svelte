<script lang="ts">
  import CalendarLayout from "$lib/features/calendar/CalendarLayout.svelte";
  import HistoryCalendar from "$lib/features/calendar/v2/HistoryCalendar.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod";
  import type { CalendarPeriod } from "$lib/features/calendar/models/CalendarLayoutProps";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { SocialActivity } from "$lib/requests/models/SocialActivity";
  import { HISTORY_UPPER_LIMIT } from "$lib/utils/constants";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList";

  const { mode } = useDiscover();
  const { filterMap } = useFilter();

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

  const now = new Date();

  const { activityCalendar, isLoading } = $derived(
    useActivityList({
      type: $mode,
      filter: $filterMap,
      range: {
        startDate: $startDate,
        endDate: $endDate,
      },
      limit: HISTORY_UPPER_LIMIT,
    }),
  );

  const periods: CalendarPeriod<SocialActivity>[] = $derived(
    accumulate({
      calendar: $activityCalendar,
      fingerprint: `${$mode}:${JSON.stringify($filterMap)}`,
    }),
  );

  const navigation = $derived({
    onNext: next,
    onPrevious: previous,
    onReset: reset,
  });

  const { isEnabled } = useFeatureFlag();
  const isRedesign = isEnabled(FeatureFlag.CalendarRedesign);
  const Layout = $derived($isRedesign ? HistoryCalendar : CalendarLayout);
</script>

<Layout
  activeDate={$activeDate}
  isLoading={$isLoading}
  {navigation}
  onLoadMore={loadMore}
  {periods}
  layout="list"
  maxDate={now}
  {order}
>
  {#snippet item(activity)}
    <SocialActivityItem {activity} style="summary" />
  {/snippet}
</Layout>
