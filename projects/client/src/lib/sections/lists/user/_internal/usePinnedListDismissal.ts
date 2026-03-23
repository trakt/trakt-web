import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, map } from 'rxjs';

const LOCAL_STORAGE_KEY = 'trakt-dismissed-pinned-lists';

type DismissedLists = Record<string, boolean>;

function getDismissedLists(): DismissedLists {
  const stored = safeLocalStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return {};

  try {
    return JSON.parse(stored) as DismissedLists;
  } catch {
    return {};
  }
}

function saveDismissedLists(dismissed: DismissedLists) {
  safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dismissed));
}

const dismissedLists$ = new BehaviorSubject(getDismissedLists());

export function usePinnedListDismissal(userId: string, listId: string) {
  const key = `${userId}/${listId}`;

  const dismiss = () => {
    const current = dismissedLists$.value;
    const updated = { ...current, [key]: true };
    saveDismissedLists(updated);
    dismissedLists$.next(updated);
  };

  return {
    dismiss,
    isDismissed: dismissedLists$.pipe(
      map(($dismissed) => $dismissed[key] === true),
    ),
  };
}
