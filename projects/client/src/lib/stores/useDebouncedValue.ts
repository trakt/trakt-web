import { debounce } from '$lib/utils/timing/debounce.ts';
import { BehaviorSubject } from 'rxjs';

export function useDebouncedValue<T>(delay: number) {
  const internal = new BehaviorSubject<T | Nil>(null);

  const debouncedNext = debounce((newValue: T | Nil) => {
    internal.next(newValue);
  }, delay);

  const next = (newValue: T | Nil) => {
    if (internal.value == null) {
      internal.next(newValue);
    } else {
      debouncedNext(newValue);
    }
  };

  return {
    subscribe: internal.subscribe.bind(internal),
    next,
    getValue: () => internal.value,
  };
}
