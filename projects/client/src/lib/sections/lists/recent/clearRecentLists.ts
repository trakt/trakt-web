import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import {
  RECENT_LISTS_STORAGE_KEY,
  recentListsSubject,
} from './_internal/recentListsSubject.ts';

export function clearRecentLists() {
  safeLocalStorage.removeItem(RECENT_LISTS_STORAGE_KEY);
  recentListsSubject.next([]);
}
