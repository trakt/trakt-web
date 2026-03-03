<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { getDaysDifference } from "$lib/utils/date/getDaysDifference";
  import NoItems from "./_internal/NoItems.svelte";
  import { useCalendar } from "./_internal/useCalendar";
  import CalendarItem from "./CalendarItem.svelte";
  import CalendarLayout from "./CalendarLayout.svelte";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";

  const { startDate, endDate, next, previous, reset, activeDate } =
    useCalendarPeriod();
  const { mode } = useDiscover();

  const days = $derived(getDaysDifference($startDate, $endDate));

  const { isLoading, calendar } = $derived(
    useCalendar({
      start: $startDate,
      days,
      type: $mode,
    }),
  );
</script>

<CalendarLayout
  calendar={$calendar}
  activeDate={$activeDate}
  isLoading={$isLoading}
  onNext={next}
  onPrevious={previous}
  onReset={reset}
>
  {#snippet item(media)}
    <CalendarItem item={media} variant="summary" />
  {/snippet}

  {#snippet empty()}
    <NoItems />
  {/snippet}
</CalendarLayout>
