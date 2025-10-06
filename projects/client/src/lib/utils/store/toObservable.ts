import { Observable } from 'rxjs';
import type { Readable } from 'svelte/store';

export function toObservable<T>(readable: Readable<T>): Observable<T> {
  return new Observable((subscriber) => {
    const unsubscribe = readable.subscribe((value) => {
      subscriber.next(value);
    });

    return () => {
      unsubscribe();
    };
  });
}
