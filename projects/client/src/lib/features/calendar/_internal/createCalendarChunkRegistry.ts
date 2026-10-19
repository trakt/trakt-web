import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  type Observable,
  of,
  ReplaySubject,
  scan,
  startWith,
  switchMap,
} from 'rxjs';
import type { CalendarChunkResult } from '../models/CalendarChunkResult.ts';
import type { CalendarChunkState } from '../models/CalendarChunkState.ts';

type ChunkStates<T> = ReadonlyMap<string, CalendarChunkState<T>>;

const INITIAL_STATE = {
  calendar: null,
  isLoading: true,
  hasUpstreamItems: false,
};

function toStateStream<T>(result: CalendarChunkResult<T>) {
  return combineLatest([
    result.calendar.pipe(startWith(null)),
    result.isLoading.pipe(startWith(true)),
    result.hasUpstreamItems.pipe(startWith(false)),
  ]).pipe(
    debounceTime(0),
    scan(
      (
        previous: CalendarChunkState<T>,
        [calendar, isLoading, hasUpstreamItems],
      ): CalendarChunkState<T> => ({
        calendar,
        isLoading: previous.isLoading && isLoading,
        hasUpstreamItems,
      }),
      INITIAL_STATE,
    ),
  );
}

export function createCalendarChunkRegistry<T>() {
  const entries = new BehaviorSubject<
    ReadonlyMap<string, Observable<CalendarChunkState<T>>>
  >(new Map());

  const register = (key: string, result: CalendarChunkResult<T>) => {
    const state = new ReplaySubject<CalendarChunkState<T>>(1);
    const subscription = toStateStream(result).subscribe(state);

    entries.next(new Map(entries.value).set(key, state));

    return () => {
      subscription.unsubscribe();
      const next = new Map(entries.value);
      next.delete(key);
      entries.next(next);
    };
  };

  const states: Observable<ChunkStates<T>> = entries.pipe(
    switchMap((current) =>
      current.size === 0
        ? of(new Map())
        : combineLatest(
            Array.from(current, ([key, state]) =>
              state.pipe(map((value) => [key, value] as const)),
            ),
          ).pipe(map((list) => new Map(list))),
    ),
  );

  return { register, states };
}
