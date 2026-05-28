<script lang="ts" generics="T extends { key: string }">
  import type { Snippet } from "svelte";
  import type { Calendar } from "../models/Calendar.ts";
  import CalendarDayHeader from "./CalendarDayHeader.svelte";
  import { dateKey } from "./dateKey.ts";

  const {
    calendar,
    item,
  }: {
    calendar: Calendar<T>;
    item: Snippet<[T]>;
  } = $props();
</script>

<div class="calendar-week-row">
  {#each calendar as day (dateKey(day.date))}
    <div id={dateKey(day.date)} class="calendar-day-column calendar-day-anchor">
      <CalendarDayHeader date={day.date} count={day.items.length} />
      <div class="calendar-day-items">
        {#each day.items as media (media.key)}
          {@render item(media)}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-week-row {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0;
  }

  .calendar-day-column {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    min-width: 0;

    scroll-margin-top: var(--calendar-nav-bottom, 0px);

    /* 1px vertical separators between adjacent day columns. The headers
       sit on top of the column so the line also runs between them
       visually, uniting the header band into a single strip. */
    border-right: var(--border-thickness-xxs) solid var(--shade-800);

    &:last-child {
      border-right: none;
    }
  }

  .calendar-day-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    /* Cards inside the column should respect the column width — let any
       fixed-width card scale down so the 7-col grid never overflows. */
    :global(.trakt-card),
    :global(trakt-calendar-item) {
      width: 100%;
      max-width: 100%;
    }
  }
</style>
