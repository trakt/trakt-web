import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { describe, expect, it } from 'vitest';
import { findPendingOverride } from './findPendingOverride.ts';

describe('util: findPendingOverride', () => {
  it('should find an action covering all requested keys', () => {
    const action = buildOfflineAction({ keys: ['movie:1', 'movie:2'] });

    const result = findPendingOverride({
      actions: [action],
      domain: 'history',
      keys: ['movie:1'],
    });

    expect(result).toBe(action);
  });

  it('should ignore actions from other domains', () => {
    const action = buildOfflineAction({ endpoint: 'watchlist:add' });

    const result = findPendingOverride({
      actions: [action],
      domain: 'history',
      keys: ['movie:1'],
    });

    expect(result).toBeNull();
  });

  it('should ignore actions that only cover some keys', () => {
    const action = buildOfflineAction({ keys: ['movie:1'] });

    const result = findPendingOverride({
      actions: [action],
      domain: 'history',
      keys: ['movie:1', 'movie:2'],
    });

    expect(result).toBeNull();
  });

  it('should return the latest covering action', () => {
    const add = buildOfflineAction({ endpoint: 'history:add' });
    const remove = buildOfflineAction({
      endpoint: 'history:remove',
      queuedAt: 2,
    });

    const result = findPendingOverride({
      actions: [add, remove],
      domain: 'history',
      keys: ['movie:1'],
    });

    expect(result).toBe(remove);
  });

  it('should return null for empty keys', () => {
    const result = findPendingOverride({
      actions: [buildOfflineAction()],
      domain: 'history',
      keys: [],
    });

    expect(result).toBeNull();
  });
});
