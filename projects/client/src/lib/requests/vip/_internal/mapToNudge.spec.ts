import type { NudgeResponse } from '$lib/requests/models/NudgeResponse.ts';
import { describe, expect, it } from 'vitest';
import { mapToNudge } from './mapToNudge.ts';

const limitResponse = (limit: string | null): NudgeResponse => ({
  nudge: { type: 'limit', limit, used: 830, total: 1000 },
});

describe('util: mapToNudge', () => {
  it('should map a null nudge to no card', () => {
    expect(mapToNudge({ nudge: null })).toBeNull();
  });

  it('should map a missing nudge to no card', () => {
    expect(mapToNudge({})).toBeNull();
    expect(mapToNudge(undefined)).toBeNull();
  });

  it('should map the feature nudge', () => {
    expect(mapToNudge({ nudge: { type: 'vip' } })).toEqual({ type: 'vip' });
  });

  it.each([
    ['watchlist_items', 'watchlistItems'],
    ['total_list_items', 'totalListItems'],
    ['static_lists', 'staticLists'],
    ['total_notes', 'totalNotes'],
  ])('should map the %s limit nudge', (metric, limit) => {
    expect(mapToNudge(limitResponse(metric))).toEqual({
      type: 'limit',
      limit,
      used: 830,
      total: 1000,
    });
  });

  it('should map an unknown nudge type to no card', () => {
    expect(mapToNudge({ nudge: { type: 'survey' } })).toBeNull();
    expect(
      mapToNudge({
        nudge: { type: 'survey', limit: 'static_lists', used: 1, total: 2 },
      }),
    ).toBeNull();
  });

  it('should map an unknown limit metric to no card', () => {
    expect(mapToNudge(limitResponse('history'))).toBeNull();
    expect(mapToNudge(limitResponse('constructor'))).toBeNull();
    expect(mapToNudge(limitResponse(null))).toBeNull();
  });

  it('should map a limit nudge without counts to no card', () => {
    expect(
      mapToNudge({ nudge: { type: 'limit', limit: 'static_lists', used: 3 } }),
    ).toBeNull();
  });
});
