import { chunk as toGroups } from '$lib/utils/array/chunk.ts';
import { DAYS_IN_WEEK } from '$lib/utils/constants.ts';
import type { CalendarChunk } from '../models/CalendarChunk.ts';
import type { CalendarChunkState } from '../models/CalendarChunkState.ts';
import type { CalendarPeriod } from '../models/CalendarLayoutProps.ts';
import type { CalendarOrder } from '../models/CalendarOrder.ts';
import { dateKey } from './dateKey.ts';
import { toChunkStateKey } from './toChunkStateKey.ts';

type LoadedPeriod<T> = CalendarPeriod<T> & { isEmpty: boolean };

type ToCalendarPeriodsParams<T> = {
  chunks: ReadonlyArray<CalendarChunk>;
  states: ReadonlyMap<string, CalendarChunkState<T>> | undefined;
  keyPrefix: string;
  order: CalendarOrder;
};

function toPeriods<T>(state: CalendarChunkState<T>): LoadedPeriod<T>[] {
  const weeks = toGroups(state.calendar ?? [], DAYS_IN_WEEK);

  return weeks.map((week) => ({
    key: dateKey(week.at(0)?.date ?? new Date(0)),
    calendar: week,
    isEmpty:
      weeks.length === 1
        ? !state.hasUpstreamItems
        : week.every((day) => day.items.length === 0),
  }));
}

type CalendarBoard<T> = {
  periods: LoadedPeriod<T>[];
  emptyAbove: number;
  emptyBelow: number;
  isInitialLoad: boolean;
  isLoadingAbove: boolean;
  isLoadingBelow: boolean;
};

export function toCalendarPeriods<T>({
  chunks,
  states,
  keyPrefix,
  order,
}: ToCalendarPeriodsParams<T>): CalendarBoard<T> {
  const toState = (chunk: CalendarChunk) =>
    states?.get(toChunkStateKey({ prefix: keyPrefix, chunk }));
  const isLoaded = (chunk: CalendarChunk | undefined) => {
    const state = chunk ? toState(chunk) : undefined;
    return Boolean(state && !state.isLoading && state.calendar);
  };

  const anchorIndex = chunks.findIndex((chunk) => chunk.isAnchor);
  const anchorChunk = chunks.at(anchorIndex);

  if (anchorIndex === -1 || !isLoaded(anchorChunk)) {
    return {
      periods: [],
      emptyAbove: 0,
      emptyBelow: 0,
      isInitialLoad: true,
      isLoadingAbove: false,
      isLoadingBelow: false,
    };
  }

  const firstLoaded =
    chunks.findLastIndex(
      (chunk, index) => index < anchorIndex && !isLoaded(chunk),
    ) + 1;
  const firstPending = chunks.findIndex(
    (chunk, index) => index > anchorIndex && !isLoaded(chunk),
  );
  const lastLoaded = firstPending === -1 ? chunks.length - 1 : firstPending - 1;

  const ascending = chunks
    .slice(firstLoaded, lastLoaded + 1)
    .flatMap((chunk) => {
      const state = toState(chunk);
      return state ? toPeriods(state) : [];
    });

  const periods =
    order === 'chronological' ? ascending : ascending.toReversed();
  const firstFilled = periods.findIndex((period) => !period.isEmpty);
  const lastFilled = periods.findLastIndex((period) => !period.isEmpty);

  const isLoadingEarlier = firstLoaded > 0;
  const isLoadingLater = lastLoaded < chunks.length - 1;
  const isChronological = order === 'chronological';

  return {
    periods,
    emptyAbove: firstFilled === -1 ? periods.length : firstFilled,
    emptyBelow: periods.length - 1 - lastFilled,
    isInitialLoad: false,
    isLoadingAbove: isChronological ? isLoadingEarlier : isLoadingLater,
    isLoadingBelow: isChronological ? isLoadingLater : isLoadingEarlier,
  };
}
