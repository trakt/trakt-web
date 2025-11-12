import type { Observable } from 'rxjs';
import { readable } from 'svelte/store';

export function toStore<T>(observable$: Observable<T>) {
  return readable(undefined as T, (set) => {
    const subscription = observable$.subscribe(set);
    return () => subscription.unsubscribe();
  });
}
