import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RECENTLY_WATCHED_WINDOW } from '../constants/index.ts';
import type { DismissedItem } from '../models/DismissedItem.ts';
import { normalizeDismissalItems } from './normalizeDismissalItems.ts';

describe('normalizeDismissalItems', () => {
  const NOW = 1_700_000_000_000;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  it('should keep items dismissed within the recently watched window', () => {
    const withinWindow: DismissedItem = {
      id: '1',
      type: 'movie',
      dismissedAt: NOW - RECENTLY_WATCHED_WINDOW + 1,
    };

    expect(normalizeDismissalItems([withinWindow])).toEqual([withinWindow]);
  });

  it('should drop items dismissed before the cutoff', () => {
    const tooOld: DismissedItem = {
      id: '1',
      type: 'movie',
      dismissedAt: NOW - RECENTLY_WATCHED_WINDOW - 1,
    };

    expect(normalizeDismissalItems([tooOld])).toEqual([]);
  });

  it('should treat items dismissed exactly at the cutoff as valid', () => {
    const atCutoff: DismissedItem = {
      id: '1',
      type: 'movie',
      dismissedAt: NOW - RECENTLY_WATCHED_WINDOW,
    };

    expect(normalizeDismissalItems([atCutoff])).toEqual([atCutoff]);
  });

  it('should filter a mixed list', () => {
    const valid: DismissedItem = {
      id: '1',
      type: 'movie',
      dismissedAt: NOW - 60_000,
    };

    const invalid: DismissedItem = {
      id: '2',
      type: 'movie',
      dismissedAt: NOW - RECENTLY_WATCHED_WINDOW - 1,
    };

    expect(normalizeDismissalItems([invalid, valid])).toEqual([valid]);
  });
});
