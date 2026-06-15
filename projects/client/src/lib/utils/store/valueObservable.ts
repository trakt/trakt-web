import { BehaviorSubject, type Observable } from 'rxjs';

/**
 * Lift a static value into an Observable that never completes.
 *
 * Use when a hook expects `Observable<T>` but the caller only has a single
 * fixed value (e.g. unit tests, one-shot fetches). Prefer this over `of()`,
 * which completes synchronously - completion propagates through the
 * reactive query bridge and closes the outer subscriber before async
 * results can land.
 */
export function valueObservable<T>(value: T): Observable<T> {
  return new BehaviorSubject(value).asObservable();
}
