import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { debounce } from '$lib/utils/timing/debounce.ts';
import { time } from '$lib/utils/timing/time.ts';
import { isSameDay } from 'date-fns';
import { onMount } from 'svelte';
import { useCalendarPeriod } from '../context/useCalendarPeriod.ts';
import type { CalendarEntry } from '../models/CalendarEntry.ts';
import { getMostVisibleDay } from './getMostVisibleDay.ts';
import { scrollToDate } from './scrollToDate.ts';

type SyncScrollProps = {
  calendar: CalendarEntry[];
  offset: number;
};

export function syncScroll(
  _: HTMLElement,
  { calendar, offset }: SyncScrollProps,
) {
  const { activeDate } = useCalendarPeriod();

  const handleScroll = () => {
    const date = getMostVisibleDay(calendar, offset);
    const isActive = date && isSameDay(date, activeDate.value.date);

    if (!date || isActive) {
      return;
    }

    activeDate.next({ date, source: 'scroll' });
  };

  onMount(() => {
    const unregisterScroll = GlobalEventBus.getInstance().register(
      'scroll',
      () => debounce(handleScroll, time.fps(30))(),
    );

    const subscription = activeDate
      .subscribe(
        (value) => requestAnimationFrame(() => scrollToDate(value, offset)),
      );

    return () => {
      unregisterScroll();
      subscription.unsubscribe();
    };
  });
}
