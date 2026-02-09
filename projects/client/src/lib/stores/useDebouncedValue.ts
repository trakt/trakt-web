import {
  BehaviorSubject,
  concatMap,
  debounceTime,
  of,
  pairwise,
  startWith,
} from 'rxjs';

const INITIAL_VALUE = null;

export function useDebouncedValue<T>(delay: number) {
  const value = new BehaviorSubject<T | Nil>(INITIAL_VALUE);

  const debounced = value.pipe(
    startWith(INITIAL_VALUE),
    pairwise(),
    concatMap(([prevValue, newValue]) =>
      prevValue === INITIAL_VALUE
        ? of(newValue)
        : of(newValue).pipe(debounceTime(delay))
    ),
  );

  return {
    subscribe: debounced.subscribe.bind(debounced),
    set: value.next.bind(value),
    update: (fn: (current: T | Nil) => T) => {
      value.next(fn(value.value));
    },
  };
}
