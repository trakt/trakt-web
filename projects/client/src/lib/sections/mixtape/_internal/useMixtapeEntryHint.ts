import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import {
  combineLatest,
  concat,
  filter,
  map,
  type Observable,
  startWith,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';

const HINT_STORAGE_KEY = 'mixtape-entry-hint-shown';
const HINT_DELAY = 600;
const HINT_DURATION = 3200;

type MixtapeEntryHintProps = {
  isActive: Observable<boolean>;
  isTouch: Observable<boolean>;
};

export function useMixtapeEntryHint({
  isActive,
  isTouch,
}: MixtapeEntryHintProps) {
  const isShown = combineLatest([isActive, isTouch]).pipe(
    filter(
      ([$isActive, $isTouch]) =>
        $isActive && $isTouch && !safeLocalStorage.getItem(HINT_STORAGE_KEY),
    ),
    take(1),
    tap(() =>
      safeLocalStorage.setItem(HINT_STORAGE_KEY, new Date().toISOString()),
    ),
    switchMap(() =>
      concat(
        timer(HINT_DELAY).pipe(map(() => true)),
        timer(HINT_DURATION).pipe(map(() => false)),
      ),
    ),
    startWith(false),
  );

  return { isShown };
}
