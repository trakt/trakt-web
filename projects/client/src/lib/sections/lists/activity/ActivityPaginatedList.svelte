<script lang="ts">
  import CalendarLayout from "$lib/features/calendar/CalendarLayout.svelte";
  import { useCalendarPeriod } from "$lib/features/calendar/context/useCalendarPeriod";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { HISTORY_UPPER_LIMIT } from "$lib/utils/constants";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList";

  type RecommendedListProps = { title: string };

  const { mode } = useDiscover();
  const { filterMap } = useFilter();

  const { startDate, endDate, activeDate, next, previous, reset } =
    useCalendarPeriod();

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
</script>

<CalendarLayout
  calendar={$activityCalendar}
  activeDate={$activeDate}
  isLoading={$isLoading}
  onNext={next}
  onPrevious={previous}
  onReset={reset}
  layout="list"
  maxDate={now}
>
  {#snippet item(activity)}
    <SocialActivityItem {activity} style="summary" />
  {/snippet}
</CalendarLayout>
