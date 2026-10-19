<script lang="ts" generics="T">
  import { isToday } from "date-fns/isToday";
  import type { Calendar } from "../models/Calendar.ts";
  import { dateKey } from "./dateKey.ts";
  import CalendarDayHeader from "./CalendarDayHeader.svelte";

  const { calendar }: { calendar: Calendar<T> } = $props();
</script>

<div class="trakt-calendar-week-head">
  {#each calendar as day (dateKey(day.date))}
    <div class="week-head-day" class:is-today={isToday(day.date)}>
      <CalendarDayHeader
        date={day.date}
        count={day.items.length}
        variant="column"
      />
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-week-head {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--gap-xs);
  }

  .week-head-day {
    padding: var(--gap-xs) var(--ni-6);
    border-start-start-radius: var(--border-radius-l);
    border-start-end-radius: var(--border-radius-l);

    &.is-today {
      background-color: color-mix(
        in srgb,
        var(--color-calendar-item-indicator) 12%,
        transparent
      );
    }
  }

  @include for-tablet-lg {
    .trakt-calendar-week-head {
      display: none;
    }
  }
</style>
