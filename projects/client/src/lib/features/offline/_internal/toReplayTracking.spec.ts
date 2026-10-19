import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { describe, expect, it } from 'vitest';
import { toReplayTracking } from './toReplayTracking.ts';

describe('util: toReplayTracking', () => {
  it('should label executed and failed actions by endpoint', () => {
    const done = buildOfflineAction({ endpoint: 'favorites:add' });
    const failed = buildOfflineAction({ endpoint: 'rating:remove' });

    expect(
      toReplayTracking({
        actions: [done, failed],
        outcome: { executedIds: [done.id], failedIds: [failed.id] },
      }),
    ).toEqual([
      { type: 'favorites:add', outcome: 'done' },
      { type: 'rating:remove', outcome: 'failed' },
    ]);
  });

  it('should skip actions that were held back or left queued', () => {
    const held = buildOfflineAction({ endpoint: 'history:add' });

    expect(
      toReplayTracking({
        actions: [held],
        outcome: { executedIds: [], failedIds: [] },
      }),
    ).toEqual([]);
  });

  it('should never carry media keys', () => {
    const action = buildOfflineAction({ keys: ['movie:12345'] });

    expect(
      JSON.stringify(
        toReplayTracking({
          actions: [action],
          outcome: { executedIds: [action.id], failedIds: [] },
        }),
      ),
    ).not.toContain('12345');
  });
});
