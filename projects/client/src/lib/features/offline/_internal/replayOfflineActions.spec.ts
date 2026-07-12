import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { describe, expect, it, vi } from 'vitest';
import type { OfflineAction } from '../models/OfflineAction.ts';
import type { FreshWatchedState } from './FreshWatchedState.ts';
import { replayOfflineActions } from './replayOfflineActions.ts';

const QUEUED_AT = new Date('2026-07-01T10:00:00Z').getTime();
const AFTER_QUEUE = new Date('2026-07-02T10:00:00Z');

function buildAction(overrides: Partial<OfflineAction> = {}): OfflineAction {
  return buildOfflineAction({
    endpoint: 'watchlist:add',
    invalidations: ['invalidate:watchlisted:movie'],
    queuedAt: QUEUED_AT,
    ...overrides,
  });
}

const emptyWatched = (): Promise<FreshWatchedState> =>
  Promise.resolve({
    movies: new Map(),
    shows: new Map(),
    episodes: new Map(),
  });

describe('util: replayOfflineActions', () => {
  it('should execute actions in order and collect invalidations', async () => {
    const executed: string[] = [];
    const first = buildAction();
    const second = buildAction({
      endpoint: 'rating:add',
      invalidations: ['invalidate:rated:movie'],
    });

    const outcome = await replayOfflineActions({
      actions: [first, second],
      execute: (action) => {
        executed.push(action.id);
        return Promise.resolve(true);
      },
      fetchWatched: emptyWatched,
    });

    expect(executed).toEqual([first.id, second.id]);
    expect(outcome.executedIds).toEqual([first.id, second.id]);
    expect(outcome.invalidations).toEqual([
      'invalidate:watchlisted:movie',
      'invalidate:rated:movie',
    ]);
    expect(outcome.aborted).toBe(false);
  });

  it('should hold back duplicate watches instead of executing them', async () => {
    const duplicate = buildAction({
      endpoint: 'history:add',
      keys: ['movie:1'],
    });
    const fresh = buildAction({
      endpoint: 'history:add',
      keys: ['movie:2'],
    });

    const execute = vi.fn(() => Promise.resolve(true));
    const outcome = await replayOfflineActions({
      actions: [duplicate, fresh],
      execute,
      fetchWatched: () =>
        Promise.resolve({
          movies: new Map([[1, AFTER_QUEUE]]),
          shows: new Map(),
          episodes: new Map(),
        }),
    });

    expect(outcome.duplicates).toEqual([duplicate]);
    expect(outcome.executedIds).toEqual([fresh.id]);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('should skip reconciliation when disabled', async () => {
    const action = buildAction({ endpoint: 'history:add' });
    const fetchWatched = vi.fn(emptyWatched);

    const outcome = await replayOfflineActions({
      actions: [action],
      reconcile: false,
      execute: () => Promise.resolve(true),
      fetchWatched,
    });

    expect(fetchWatched).not.toHaveBeenCalled();
    expect(outcome.executedIds).toEqual([action.id]);
  });

  it('should not fetch watched state without queued watches', async () => {
    const fetchWatched = vi.fn(emptyWatched);

    await replayOfflineActions({
      actions: [buildAction()],
      execute: () => Promise.resolve(true),
      fetchWatched,
    });

    expect(fetchWatched).not.toHaveBeenCalled();
  });

  it('should abort and keep the rest queued on a network error', async () => {
    const first = buildAction();
    const second = buildAction({ keys: ['movie:2'] });

    const outcome = await replayOfflineActions({
      actions: [first, second],
      execute: (action) =>
        action.id === first.id
          ? Promise.reject(new TypeError('Failed to fetch'))
          : Promise.resolve(true),
      fetchWatched: emptyWatched,
    });

    expect(outcome.aborted).toBe(true);
    expect(outcome.executedIds).toEqual([]);
    expect(outcome.failedIds).toEqual([]);
  });

  it('should abort when the reconcile fetch hits a network error', async () => {
    const outcome = await replayOfflineActions({
      actions: [buildAction({ endpoint: 'history:add' })],
      execute: () => Promise.resolve(true),
      fetchWatched: () => Promise.reject(new TypeError('Failed to fetch')),
    });

    expect(outcome.aborted).toBe(true);
    expect(outcome.executedIds).toEqual([]);
  });

  it('should drop server-rejected actions as failed', async () => {
    const rejected = buildAction();
    const accepted = buildAction({ keys: ['movie:2'] });

    const outcome = await replayOfflineActions({
      actions: [rejected, accepted],
      execute: (action) => Promise.resolve(action.id !== rejected.id),
      fetchWatched: emptyWatched,
    });

    expect(outcome.failedIds).toEqual([rejected.id]);
    expect(outcome.executedIds).toEqual([accepted.id]);
    expect(outcome.invalidations).toEqual(['invalidate:watchlisted:movie']);
    expect(outcome.aborted).toBe(false);
  });
});
