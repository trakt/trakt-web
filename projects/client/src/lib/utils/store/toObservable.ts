import { Observable } from 'rxjs';

interface Readable<T> {
  subscribe(
    run: (value: T) => void,
    invalidate?: (value?: T) => void,
  ): () => void;
}

export function toObservable<T>(store: Readable<T>): Observable<T> {
  return new Observable((observer) => {
    let hasEmittedInitial = false;

    const unsubscribe = store.subscribe((value) => {
      if (!hasEmittedInitial) {
        // Keep the initial emission synchronous so consumers that read
        // the value during their first render don't see undefined.
        hasEmittedInitial = true;
        observer.next(value);
        return;
      }

      // Defer subsequent emissions so synchronous downstream subscribers
      // can't write back into a Svelte source while its effect is still
      // executing — that path triggers state_unsafe_mutation.
      queueMicrotask(() => observer.next(value));
    });

    return unsubscribe;
  });
}
