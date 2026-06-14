import { Subject } from 'rxjs';
import { debounceTime, groupBy, map, mergeMap } from 'rxjs/operators';
import { safeLocalStorage } from './safeStorage.ts';

type Write = { readonly key: string; readonly value: string };

const writes$ = new Subject<Write>();

writes$
  .pipe(
    groupBy((w) => w.key),
    mergeMap((group) =>
      group.pipe(
        debounceTime(200),
        map((latest) => latest),
      )
    ),
  )
  .subscribe(({ key, value }) => safeLocalStorage.setItem(key, value));

export function persistDebounced(key: string, value: unknown): void {
  writes$.next({ key, value: JSON.stringify(value) });
}
