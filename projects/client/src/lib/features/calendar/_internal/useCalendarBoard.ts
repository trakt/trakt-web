import { BehaviorSubject, combineLatest, map, type Observable } from 'rxjs';
import { onDestroy } from 'svelte';
import { useCalendarPeriod } from '../context/useCalendarPeriod.ts';
import type { CalendarPeriodOptions } from '../models/CalendarPeriodOptions.ts';
import { createCalendarChunkRegistry } from './createCalendarChunkRegistry.ts';
import { toCalendarPeriods } from './toCalendarPeriods.ts';
import { toChunkStateKey } from './toChunkStateKey.ts';

type UseCalendarBoardParams = CalendarPeriodOptions & {
  emptyWeekLimit: number;
  fingerprint: Observable<string>;
};

export function useCalendarBoard<T>({
  emptyWeekLimit,
  ...options
}: UseCalendarBoardParams) {
  const { order = 'chronological', fingerprint } = options;
  const period = useCalendarPeriod(options);
  const registry = createCalendarChunkRegistry<T>();

  const sources = combineLatest([period.chunks, fingerprint]).pipe(
    map(([chunks, prefix]) =>
      chunks.map((chunk) => ({
        key: toChunkStateKey({ prefix, chunk }),
        chunk,
      })),
    ),
  );

  const board = new BehaviorSubject(
    toCalendarPeriods<T>({
      chunks: [],
      states: undefined,
      keyPrefix: '',
      order,
    }),
  );

  const subscription = combineLatest([
    period.chunks,
    registry.states,
    fingerprint,
  ])
    .pipe(
      map(([chunks, states, keyPrefix]) =>
        toCalendarPeriods({ chunks, states, keyPrefix, order }),
      ),
    )
    .subscribe(board);
  onDestroy(() => subscription.unsubscribe());

  const loadMore = () => {
    if (board.value.emptyBelow >= emptyWeekLimit) return;
    period.loadMore();
  };

  const loadPrevious = () =>
    board.value.emptyAbove < emptyWeekLimit && period.loadPrevious();

  return {
    ...period,
    board,
    sources,
    register: registry.register,
    loadMore,
    loadPrevious,
  };
}
