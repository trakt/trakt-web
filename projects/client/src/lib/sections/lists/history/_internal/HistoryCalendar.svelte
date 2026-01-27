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
    {#if day.type === "placeholder"}
      <div id={dateKey(day.date)}>
        <GridList
          title={`${toHumanDay(day.date, getLocale())}${day.endDate ? ` - ${toHumanDay(day.endDate, getLocale())}` : ""}`}
          items={[]}
          id={dateKey(day.date)}
        >
          {#snippet empty()}
            <p>No watched items for this day.</p>
          {/snippet}
        </GridList>
      </div>
    {:else}
      <div id={dateKey(day.date)}>
        <GridList
          title={toHumanDay(day.date, getLocale())}
          items={day.items}
          id={dateKey(day.date)}
          --width-item={"var(--width-summary-card)"}
        >
          {#snippet item(media)}
            <RecentlyWatchedItem {media} style="summary" isActionable />
          {/snippet}
        </GridList>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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
