import { Observable } from 'rxjs';

interface Readable<T> {
  subscribe(
    run: (value: T) => void,
    invalidate?: (value?: T) => void,
  ): () => void;
}

export function toObservable<T>(store: Readable<T>): Observable<T> {
  return new Observable((observer) => {
    const unsubscribe = store.subscribe((value) => {
      observer.next(value);
    });

    return unsubscribe;
  });
}
