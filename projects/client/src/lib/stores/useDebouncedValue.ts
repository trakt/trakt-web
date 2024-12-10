import { debounce } from '$lib/utils/timing/debounce.ts';
import { get, type Writable, writable } from 'svelte/store';

export function useDebouncedValue<T>(delay: number): Writable<T | Nil> {
  const value = writable<T | Nil>(null);

  const debouncedSet = debounce((newValue: T | Nil) => {
    value.set(newValue);
  }, delay);

  const set = (newValue: T | Nil) => {
    if (get(value) == null) {
      return value.set(newValue);
    }

    return debouncedSet(newValue);
  };

  const update = (fn: (current: T | Nil) => T) => {
    set(fn(get(value)));
  };

  return {
    subscribe: value.subscribe,
    set,
    update,
  };
}
