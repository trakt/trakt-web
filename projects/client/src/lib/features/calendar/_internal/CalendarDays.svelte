<script lang="ts" generics="T extends { key: string }">
  import type { Calendar } from "../models/Calendar";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import CalendarSwipe from "./CalendarSwipe.svelte";
  import { dateKey } from "./dateKey";
  import Day from "./Day.svelte";

  type CalendarDaysProps = { calendar: Calendar<T> } & Omit<
    CalendarNavigationProps,
    "onReset"
  >;

  const { calendar, activeDate, onNext, onPrevious }: CalendarDaysProps =
    $props();
</script>

<CalendarSwipe onNextPeriod={onNext} onPreviousPeriod={onPrevious}>
  <div class="trakt-calendar-days">
    {#each calendar as day (dateKey(day.date))}
      <Day
        {day}
        isActiveDate={day.date.toDateString() === activeDate.toDateString()}
      />
    {/each}
  </div>
</CalendarSwipe>

<style>
  .trakt-calendar-days {
    position: relative;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-micro);

    border-radius: var(--border-radius-s);

    :global(.trakt-calendar-day-button) {
      flex: 1;
    }
  }
</style>
