import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { pushRecentList } from './_internal/pushRecentList.ts';
import {
  RECENT_LISTS_STORAGE_KEY,
  recentListsSubject,
} from './_internal/recentListsSubject.ts';

export function recordRecentList(listId: number) {
  const next = pushRecentList(recentListsSubject.value, listId);

  safeLocalStorage.setItem(RECENT_LISTS_STORAGE_KEY, JSON.stringify(next));
  recentListsSubject.next(next);
}
