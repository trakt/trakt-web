import { BehaviorSubject, debounceTime } from 'rxjs';

export function useDebouncedValue<T>(delay: number) {
  const value = new BehaviorSubject<T | Nil>(null);
  const debounced = value.pipe(
    debounceTime(delay),
  );

  return {
    subscribe: debounced.subscribe.bind(debounced),
    set: value.next.bind(value),
    update: (fn: (current: T | Nil) => T) => {
      value.next(fn(value.value));
    },
  };
}
