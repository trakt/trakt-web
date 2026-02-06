<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import CalendarItems from "./_internal/CalendarItems.svelte";
  import { useCalendar } from "./_internal/useCalendar";
  import CalendarLayout from "./CalendarLayout.svelte";
  import { useCalendarPeriod } from "./context/useCalendarPeriod";

  const { startDate, days, next, previous, reset, activeDate } =
    useCalendarPeriod();
  const { mode } = useDiscover();

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
  activeDate={$activeDate.date}
  isLoading={$isLoading}
  onNext={next}
  onPrevious={previous}
  onReset={reset}
>
  {#snippet children()}
    <CalendarItems calendar={$calendar} />
  {/snippet}
</CalendarLayout>
