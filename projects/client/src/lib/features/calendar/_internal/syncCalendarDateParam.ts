import { afterNavigate } from '$app/navigation';
import type { AfterNavigate } from '@sveltejs/kit';
import { getLocale } from '$lib/features/i18n/index.ts';
import { formatLocalDate } from '$lib/utils/date/formatLocalDate.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { onMount } from 'svelte';
import type { CalendarContext } from '../context/CalendarContext.ts';
import { openCalendarAt } from '../context/openCalendarAt.ts';
import { calendarDateParam } from './calendarDateParam.ts';
import { toCalendarDateValue } from './toCalendarDateValue.ts';

const isFreshStart = ({ type, to }: AfterNavigate) =>
  type === 'popstate' || (type === 'link' && !to?.url.search);

const toParamValue = (date: Date | null) =>
  date ? formatLocalDate(date) : null;

export function syncCalendarDateParam(context: CalendarContext) {
  const { visibleDate, activeDate } = context;
  const { setDate } = calendarDateParam();
  const navigated = new BehaviorSubject<void>(undefined);
  let written = toParamValue(calendarDateParam().date);

  afterNavigate((navigation) => {
    const { from, to } = navigation;
    if (from?.url.pathname !== to?.url.pathname) return;

    const { date } = calendarDateParam();
    const value = toParamValue(date);
    if (date && value === written) return;
    if (date) {
      written = value;
      return openCalendarAt(context, date);
    }

    if (isFreshStart(navigation)) return openCalendarAt(context, new Date());

    navigated.next();
  });

  onMount(() => {
    const value = combineLatest([visibleDate, activeDate]).pipe(
      map(([visible, active]) =>
        toCalendarDateValue(visible ?? active, getLocale()),
      ),
      distinctUntilChanged(),
      debounceTime(time.seconds(0.3)),
    );

    const subscription = combineLatest([value, navigated]).subscribe(
      ([date]) => {
        written = date;
        setDate(date);
      },
    );

    return () => subscription.unsubscribe();
  });
}
