<script lang="ts" generics="T extends { key: string }">
  import { getLocale } from "$lib/features/i18n";
  import type { SwipeDirection } from "$lib/components/gestures/models/SwipeDirection";
  import type { Calendar } from "../models/Calendar";
  import type { CalendarNavigationProps } from "../models/CalendarNavigationProps";
  import { isMaxWeek } from "./isMaxWeek.ts";
  import CalendarSwipe from "./CalendarSwipe.svelte";
  import { dateKey } from "./dateKey";
  import Day from "./Day.svelte";
  import { toPlaceholderWeek } from "./toPlaceholderWeek.ts";

  type CalendarDaysProps = {
    calendar: Calendar<T>;
    isLoading?: boolean;
  } & CalendarNavigationProps;

  const {
    calendar,
    activeDate,
    navigation,
    maxDate,
    isLoading = false,
  }: CalendarDaysProps = $props();

  const isPending = $derived(isLoading && calendar.length === 0);
  const days = $derived(
    isPending ? toPlaceholderWeek(activeDate, getLocale()) : calendar,
  );

  const isNextDisabled = $derived(
    isMaxWeek({ date: activeDate, maxDate, locale: getLocale() }),
  );
  const directions: SwipeDirection[] = $derived(
    isNextDisabled ? ["right"] : ["left", "right"],
  );
</script>

{#snippet calendarDays()}
  <div class="trakt-calendar-days">
    {#each days as day (dateKey(day.date))}
      <Day
        {day}
        isActiveDate={day.date.toDateString() === activeDate.toDateString()}
        isLoading={isPending}
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

    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    align-items: start;

    gap: var(--gap-micro);

    border-radius: var(--border-radius-s);

    :global(.trakt-calendar-day-button) {
      width: 100%;
      min-width: 0;
    }
  }
</style>
