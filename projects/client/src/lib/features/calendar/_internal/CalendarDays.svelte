<script lang="ts" generics="T extends { key: string }">
  import type { SwipeDirection } from "$lib/components/gestures/models/SwipeDirection";
  import { isSameWeek } from "date-fns";
  import type { Calendar } from "../models/Calendar";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import CalendarSwipe from "./CalendarSwipe.svelte";
  import { dateKey } from "./dateKey";
  import Day from "./Day.svelte";

  type CalendarDaysProps = { calendar: Calendar<T> } & CalendarNavigationProps;

  const { calendar, activeDate, navigation, maxDate }: CalendarDaysProps =
    $props();

  const isNextDisabled = $derived(
    maxDate ? isSameWeek(activeDate, maxDate) : false,
  );
  const directions: SwipeDirection[] = $derived(
    isNextDisabled ? ["right"] : ["left", "right"],
  );
</script>

{#snippet calendarDays()}
  <div class="trakt-calendar-days">
    {#each calendar as day (dateKey(day.date))}
      <Day
        {day}
        isActiveDate={day.date.toDateString() === activeDate.toDateString()}
      />
    {/each}
  </div>
{/snippet}

{#if navigation}
  <CalendarSwipe
    onNextPeriod={navigation.onNext}
    onPreviousPeriod={navigation.onPrevious}
    {directions}
  >
    {@render calendarDays()}
  </CalendarSwipe>
{:else}
  {@render calendarDays()}
{/if}

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
