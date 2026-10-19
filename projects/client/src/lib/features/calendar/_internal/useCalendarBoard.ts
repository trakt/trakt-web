import { BehaviorSubject, combineLatest, map, type Observable } from 'rxjs';
import { onDestroy } from 'svelte';
import { useCalendarPeriod } from '../context/useCalendarPeriod.ts';
import type { CalendarOrder } from '../models/CalendarOrder.ts';
import { createCalendarChunkRegistry } from './createCalendarChunkRegistry.ts';
import { toCalendarPeriods } from './toCalendarPeriods.ts';
import { toChunkStateKey } from './toChunkStateKey.ts';

type UseCalendarBoardParams = {
  order?: CalendarOrder;
  weeksPerStep?: number;
  upperBound?: Date;
  emptyWeekLimit: number;
  fingerprint: Observable<string>;
  minLater?: Observable<number>;
};

export function useCalendarBoard<T>({
  order = 'chronological',
  weeksPerStep,
  upperBound,
  emptyWeekLimit,
  fingerprint,
  minLater,
}: UseCalendarBoardParams) {
  const period = useCalendarPeriod({
    order,
    weeksPerStep,
    upperBound,
    fingerprint,
    minLater,
  });
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
