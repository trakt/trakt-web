import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';

type WithPendingIntentParams = {
  current: Observable<boolean>;
  isAdding: Observable<boolean>;
  isRemoving: Observable<boolean>;
};

export function withPendingIntent({
  current,
  isAdding,
  isRemoving,
}: WithPendingIntentParams): Observable<boolean> {
  return combineLatest([current, isAdding, isRemoving]).pipe(
    map(([isCurrent, adding, removing]) => {
      if (removing) return false;
      if (adding) return true;

      return isCurrent;
    }),
    distinctUntilChanged(),
  );
}
