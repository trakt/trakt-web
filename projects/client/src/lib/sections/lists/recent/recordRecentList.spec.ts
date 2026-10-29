import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  RECENT_LISTS_STORAGE_KEY,
  recentListsSubject,
} from './_internal/recentListsSubject.ts';
import { clearRecentLists } from './clearRecentLists.ts';
import { recordRecentList } from './recordRecentList.ts';

describe('util: recordRecentList', () => {
  beforeEach(() => {
    clearRecentLists();
  });

  it('should keep the newest list first and persist it', () => {
    recordRecentList(1);
    recordRecentList(2);

    expect(recentListsSubject.value).toEqual([2, 1]);
    expect(safeLocalStorage.getItem(RECENT_LISTS_STORAGE_KEY)).toBe('[2,1]');
  });

  it('should forget everything when cleared', () => {
    recordRecentList(1);

    clearRecentLists();

    expect(recentListsSubject.value).toEqual([]);
    expect(safeLocalStorage.getItem(RECENT_LISTS_STORAGE_KEY)).toBeFalsy();
  });
});
