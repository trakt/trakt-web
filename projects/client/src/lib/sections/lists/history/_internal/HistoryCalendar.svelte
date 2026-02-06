<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { dateKey } from "$lib/features/calendar/_internal/dateKey";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import type { HistoryCalendar } from "../../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "../RecentlyWatchedItem.svelte";

  const {
    calendar,
  }: {
    calendar: HistoryCalendar[];
  } = $props();
  //TODO merge with CalendarItems.svelte
</script>

<div class="trakt-calendar-items">
  {#each calendar as day (dateKey(day.date))}
    <div id={dateKey(day.date)} class="calendar-day-anchor">
      <GridList
        title={toHumanDay(day.date, getLocale())}
        items={day.items}
        --width-item={"var(--width-summary-card)"}
        id={`history-${dateKey(day.date)}`}
      >
        {#snippet item(media)}
          <RecentlyWatchedItem {media} style="summary" isActionable />
        {/snippet}
      </GridList>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-day-anchor {
    scroll-margin-top: var(--calendar-nav-bottom, 0px);
  }

  .trakt-calendar-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    :global(.trakt-card) {
      :global(.trakt-card-cover-tag) {
        display: none;
      }
    }
  }
</style>
