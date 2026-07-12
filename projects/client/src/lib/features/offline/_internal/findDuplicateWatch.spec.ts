import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { describe, expect, it } from 'vitest';
import type { OfflineAction } from '../models/OfflineAction.ts';
import { findDuplicateWatch } from './findDuplicateWatch.ts';
import type { FreshWatchedState } from './FreshWatchedState.ts';

const QUEUED_AT = new Date('2026-07-01T10:00:00Z').getTime();
const BEFORE_QUEUE = new Date('2026-06-30T10:00:00Z');
const AFTER_QUEUE = new Date('2026-07-02T10:00:00Z');

function buildAction(overrides: Partial<OfflineAction> = {}): OfflineAction {
  return buildOfflineAction({ queuedAt: QUEUED_AT, ...overrides });
}

function buildWatched(
  overrides: Partial<FreshWatchedState> = {},
): FreshWatchedState {
  return {
    movies: new Map(),
    shows: new Map(),
    episodes: new Map(),
    ...overrides,
  };
}

describe('util: findDuplicateWatch', () => {
  it('should flag a movie watched elsewhere after it was queued', () => {
    const watched = buildWatched({ movies: new Map([[1, AFTER_QUEUE]]) });

    expect(findDuplicateWatch({ action: buildAction(), watched })).toBe(true);
  });

  it('should not flag a movie watched before it was queued', () => {
    const watched = buildWatched({ movies: new Map([[1, BEFORE_QUEUE]]) });

    expect(findDuplicateWatch({ action: buildAction(), watched })).toBe(false);
  });

  it('should not flag a movie without any server plays', () => {
    expect(
      findDuplicateWatch({ action: buildAction(), watched: buildWatched() }),
    )
      .toBe(false);
  });

  it('should flag an episode watched elsewhere after it was queued', () => {
    const action = buildAction({ keys: ['episode:42'] });
    const watched = buildWatched({ episodes: new Map([[42, AFTER_QUEUE]]) });

    expect(findDuplicateWatch({ action, watched })).toBe(true);
  });

  it('should flag a show with plays recorded after it was queued', () => {
    const action = buildAction({ keys: ['show:7'] });
    const watched = buildWatched({ shows: new Map([[7, AFTER_QUEUE]]) });

    expect(findDuplicateWatch({ action, watched })).toBe(true);
  });

  it('should flag a bulk action when any target is a duplicate', () => {
    const action = buildAction({ keys: ['movie:1', 'movie:2'] });
    const watched = buildWatched({ movies: new Map([[2, AFTER_QUEUE]]) });

    expect(findDuplicateWatch({ action, watched })).toBe(true);
  });

  it('should never flag non-watch actions', () => {
    const action = buildAction({ endpoint: 'history:remove' });
    const watched = buildWatched({ movies: new Map([[1, AFTER_QUEUE]]) });

    expect(findDuplicateWatch({ action, watched })).toBe(false);
  });
});
