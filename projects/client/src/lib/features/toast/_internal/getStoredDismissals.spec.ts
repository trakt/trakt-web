import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DISMISSAL_STORAGE_KEY,
  RECENTLY_WATCHED_WINDOW,
} from '../constants/index.ts';
import type {
  StoredDismissalsV1,
  StoredDismissalsV2,
} from '../models/StoredDismissal.ts';
import { getStoredDismissals } from './getStoredDismissals.ts';

describe('getStoredDismissals', () => {
  const NOW = 1_700_000_000_000;

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  it('should return the default structure when nothing is stored', () => {
    expect(getStoredDismissals()).toEqual({
      version: 2,
      items: [],
      isSuppressed: false,
      dismissalCount: 0,
    });
  });

  it('should return the default structure when JSON is invalid', () => {
    localStorage.setItem(DISMISSAL_STORAGE_KEY, 'not-json');
    expect(getStoredDismissals()).toEqual({
      version: 2,
      items: [],
      isSuppressed: false,
      dismissalCount: 0,
    });
  });

  it('should return the default structure when the store version is incompatible', () => {
    localStorage.setItem(
      DISMISSAL_STORAGE_KEY,
      JSON.stringify({ version: 999, items: [] }),
    );

    expect(getStoredDismissals()).toEqual({
      version: 2,
      items: [],
      isSuppressed: false,
      dismissalCount: 0,
    });
  });

  it('should normalize and return v2 stored dismissals', () => {
    const stored: StoredDismissalsV2 = {
      version: 2,
      isSuppressed: false,
      dismissalCount: 0,
      items: [
        { id: '1', type: 'movie', dismissedAt: NOW - 1 },
        {
          id: '2',
          type: 'movie',
          dismissedAt: NOW - RECENTLY_WATCHED_WINDOW - 1,
        },
      ],
    };

    localStorage.setItem(DISMISSAL_STORAGE_KEY, JSON.stringify(stored));

    expect(getStoredDismissals()).toEqual({
      version: 2,
      items: [{ id: '1', type: 'movie', dismissedAt: NOW - 1 }],
      isSuppressed: false,
      dismissalCount: 0,
    });
  });

  it('should migrate v1 stored dismissal into v2 structure', () => {
    const v1: StoredDismissalsV1 = {
      id: 1,
      type: 'movie',
      dismissedAt: NOW - 10_000,
    };
    localStorage.setItem(DISMISSAL_STORAGE_KEY, JSON.stringify(v1));

    expect(getStoredDismissals()).toEqual({
      version: 2,
      items: [{
        ...v1,
        id: v1.id.toString(),
      }],
      isSuppressed: false,
      dismissalCount: 1,
    });
  });

  it('should handle v1 stored dismissal that is too old by returning an empty list', () => {
    const v1TooOld: StoredDismissalsV1 = {
      id: 1,
      type: 'movie',
      dismissedAt: NOW - RECENTLY_WATCHED_WINDOW - 1,
    };

    localStorage.setItem(DISMISSAL_STORAGE_KEY, JSON.stringify(v1TooOld));

    expect(getStoredDismissals()).toEqual({
      version: 2,
      items: [],
      isSuppressed: false,
      dismissalCount: 0,
    });
  });
});
