import { combineLatest, map, type Observable, of } from 'rxjs';

export function anyTrue(
  sources: ReadonlyArray<Observable<boolean>>,
): Observable<boolean> {
  if (sources.length === 0) {
    return of(false);
  }

  return combineLatest(sources).pipe(map((states) => states.some(Boolean)));
}
