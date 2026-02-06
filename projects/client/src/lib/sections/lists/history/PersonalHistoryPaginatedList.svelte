<script lang="ts">
  import CalendarLayout from "$lib/features/calendar/CalendarLayout.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { getLocale } from "$lib/features/i18n";
  import { getStartOfWeek } from "$lib/utils/date/getStartOfWeek";
  import { addDays, isSameDay } from "date-fns";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode }: { mode?: DiscoverMode } = $props();

  let refDate = $state(new Date());

  const startDate = $derived(getStartOfWeek(refDate, getLocale()));
  const endDate = $derived(addDays(startDate, 6));

  const historyType = $derived(toRecentlyWatchedType(mode));

  // TODO pass in mode directly?
  const { historyCalendarItems, isLoading } = $derived(
    useRecentlyWatchedList({
      type: historyType,
      slug: "me",
      startDate,
      endDate,
    }),
  );

  const calendarWeek = $derived(
    Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startDate, i);
      const historyItem = $historyCalendarItems.find(
        (item) => item.type === "history" && isSameDay(item.date, date),
      );

      return {
        date,
        items: historyItem?.type === "history" ? historyItem.items : [],
      };
    }),
  );

  function next() {
    refDate = addDays(refDate, 7);
  }

  function previous() {
    refDate = addDays(refDate, -7);
  }

  function reset() {
    refDate = new Date();
  }
</script>

<CalendarLayout
  calendar={calendarWeek}
  activeDate={refDate}
  isLoading={$isLoading}
  onNext={next}
  onPrevious={previous}
  onReset={reset}
  cardWidth="var(--width-summary-card)"
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} style="summary" isActionable />
  {/snippet}
</CalendarLayout>
