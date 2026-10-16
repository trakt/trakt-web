import {
  debounceTime,
  distinctUntilChanged,
  map,
  type Observable,
  startWith,
} from 'rxjs';

export function toSearchTerms(search$: Observable<string>, debounceMs: number) {
  const typed$ = search$.pipe(
    map((term) => term.trim()),
    distinctUntilChanged(),
  );
  const debounced$ = typed$.pipe(
    debounceTime(debounceMs),
    startWith(''),
    distinctUntilChanged(),
  );

  return { typed$, debounced$ };
}
