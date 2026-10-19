import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { isCurrentWeek } from '$lib/utils/date/isCurrentWeek.ts';
import { addDays } from 'date-fns/addDays';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
} from 'rxjs';
import { onDestroy } from 'svelte';
import { AnalyticsEvent } from '../../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../analytics/useTrack.ts';
import { toCalendarChunks } from '../_internal/toCalendarChunks.ts';
import { toLoadDirection } from '../_internal/toLoadDirection.ts';
import type { CalendarChunk } from '../models/CalendarChunk.ts';
import type { CalendarOrder } from '../models/CalendarOrder.ts';
import type { CalendarPeriodOptions } from '../models/CalendarPeriodOptions.ts';
import type { CalendarWindow } from '../models/CalendarWindow.ts';
import { getCalendarContext } from './getCalendarContext.ts';
import { openCalendarAt } from './openCalendarAt.ts';

type Direction = 'next' | 'previous';

function getNextOrPreviousPeriod(date: Date, direction: Direction) {
  const weekStart = getStartOfWeek(date, getLocale());
  const targetWeek =
    direction === 'previous' ? subWeeks(weekStart, 1) : addWeeks(weekStart, 1);

  return getStartOfWeek(targetWeek, getLocale());
}

const LAST_DAY_OF_WEEK_OFFSET = 6;

function getActiveDate(weekStart: Date, order: CalendarOrder): Date {
  if (order === 'reverse-chronological') {
    return addDays(weekStart, LAST_DAY_OF_WEEK_OFFSET);
  }

  return weekStart;
}

const sameChunks = (
  previous: ReadonlyArray<CalendarChunk>,
  current: ReadonlyArray<CalendarChunk>,
) =>
  previous.length === current.length &&
  previous.every((chunk, index) => chunk.key === current.at(index)?.key);

export function useCalendarPeriod(options?: CalendarPeriodOptions) {
  const {
    order = 'chronological',
    weeksPerStep = 1,
    upperBound,
    lowerBound,
    fingerprint,
    minLater,
  } = options ?? {};
  const context = getCalendarContext();
  const { range, activeDate, visibleDate } = context;
  const { track } = useTrack(AnalyticsEvent.CalendarPeriod);

  const currentMinLater = new BehaviorSubject(0);

  if (minLater) {
    const subscription = minLater.subscribe(currentMinLater);
    onDestroy(() => subscription.unsubscribe());
  }

  const toChunks = (value: CalendarWindow) =>
    toCalendarChunks({
      range: value,
      weeksPerStep,
      order,
      locale: getLocale(),
      upperBound,
      lowerBound,
      minLater: currentMinLater.value,
    });

  const chunks = combineLatest([range, currentMinLater]).pipe(
    map(([value]) => toChunks(value)),
    distinctUntilChanged(sameChunks),
  );

  const open = (anchor: Date) => {
    range.next({ anchor, earlier: 0, later: 0 });
  };

  const toExtendedWindow = (direction: 'earlier' | 'later'): CalendarWindow => {
    const current = range.value;

    if (direction === 'earlier') {
      return { ...current, earlier: current.earlier + 1 };
    }

    return {
      ...current,
      later: Math.max(current.later, currentMinLater.value) + 1,
    };
  };

  const canExtend = (direction: 'earlier' | 'later') =>
    toChunks(toExtendedWindow(direction)).length > toChunks(range.value).length;

  const extend = (direction: 'earlier' | 'later') => {
    if (!canExtend(direction)) return false;

    range.next(toExtendedWindow(direction));
    return true;
  };

  const jumpTo = (date: Date) => openCalendarAt(context, date);

  if (upperBound && range.value.anchor > upperBound) {
    jumpTo(isCurrentWeek(upperBound, getLocale()) ? new Date() : upperBound);
  }

  const navigate = (direction: Direction) => {
    track({ action: direction });
    const referenceDate = visibleDate.value ?? range.value.anchor;
    const newStart = getNextOrPreviousPeriod(referenceDate, direction);

    jumpTo(getActiveDate(newStart, order));
  };

  const goTo = (date: Date, direction: Direction) => {
    track({ action: direction });
    jumpTo(date);
  };

  const restart = () => jumpTo(visibleDate.value ?? activeDate.value);

  const reset = () => {
    track({ action: 'reset' });
    const referenceDate = visibleDate.value ?? range.value.anchor;

    visibleDate.next(null);
    activeDate.next(new Date());

    if (isCurrentWeek(referenceDate, getLocale())) return;

    open(new Date());
  };

  if (fingerprint) {
    const subscription = fingerprint
      .pipe(distinctUntilChanged(), skip(1))
      .subscribe(restart);
    onDestroy(() => subscription.unsubscribe());
  }

  return {
    chunks,
    activeDate,
    next: () => navigate('next'),
    previous: () => navigate('previous'),
    loadMore: () => extend(toLoadDirection(order, 'more')),
    loadPrevious: () => extend(toLoadDirection(order, 'previous')),
    reset,
    goTo,
  };
}
