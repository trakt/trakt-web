import { isObservable, Observable } from 'rxjs';

export type StoreLike<T> = {
  subscribe: (
    run: (value: T) => void,
  ) => (() => void) | { unsubscribe: () => void };
};

export function toObservable<T>(
  source: StoreLike<T> | Observable<T>,
): Observable<T> {
  if (isObservable(source)) {
    return source;
  }

  return new Observable((subscriber) => {
    // We trust that 'source' is a StoreLike object.
    const unsubscribeOrObj = source.subscribe((value) => {
      subscriber.next(value);
    });

    return () => {
      if (typeof unsubscribeOrObj === 'function') {
        unsubscribeOrObj();
      } else if (unsubscribeOrObj && 'unsubscribe' in unsubscribeOrObj) {
        unsubscribeOrObj.unsubscribe();
      }
    };
  });
}
