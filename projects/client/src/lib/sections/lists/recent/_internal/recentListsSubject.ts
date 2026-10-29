import { safeJsonParse } from '$lib/utils/json/safeJsonParse.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { MAX_STORED_RECENT_LISTS } from './pushRecentList.ts';

export const RECENT_LISTS_STORAGE_KEY = 'recent-lists';

function readStored(): number[] {
  const parsed = safeJsonParse<unknown>(
    safeLocalStorage.getItem(RECENT_LISTS_STORAGE_KEY),
    [],
  );

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((value): value is number => Number.isInteger(value))
    .slice(0, MAX_STORED_RECENT_LISTS);
}

export const recentListsSubject = new BehaviorSubject(readStored());
