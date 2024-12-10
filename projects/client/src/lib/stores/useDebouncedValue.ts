import { debounce } from '$lib/utils/timing/debounce.ts';
import { get, type Writable, writable } from 'svelte/store';

export function useDebouncedValue<T>(
  initial: T | Nil,
  delay: number,
): Writable<T | Nil> {
  const value = writable(initial);

  const set = debounce((newValue: T) => {
    value.set(newValue);
  }, delay);

  const update = (fn: (current: T | Nil) => T) => {
    set(fn(get(value)));
  };

  return {
    subscribe: value.subscribe,
    set,
    update,
  };
}
