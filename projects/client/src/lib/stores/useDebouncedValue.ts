import {
  debounceTime,
  distinctUntilChanged,
  merge,
  share,
  skip,
  Subject,
  take,
} from 'rxjs';

export function useDebouncedValue<T>(delay: number) {
  const value = new Subject<T | Nil>();

  const shared = value.pipe(share());
  const debounced = merge(
    shared.pipe(take(1)),
    shared.pipe(skip(1), debounceTime(delay)),
  ).pipe(distinctUntilChanged());

  return {
    subscribe: debounced.subscribe.bind(debounced),
    set: value.next.bind(value),
  };
}
