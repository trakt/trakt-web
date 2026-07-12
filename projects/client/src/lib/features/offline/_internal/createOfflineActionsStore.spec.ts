import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { describe, expect, it, vi } from 'vitest';
import type { OfflineAction } from '../models/OfflineAction.ts';
import { createOfflineActionsStore } from './createOfflineActionsStore.ts';
import type { OfflineActionsStorage } from './OfflineActionsStorage.ts';

function createMemoryStorage(
  initial: OfflineAction[] = [],
): OfflineActionsStorage & { stored: () => OfflineAction[] } {
  let stored = initial;

  return {
    read: () => Promise.resolve(stored),
    write: (actions) => {
      stored = actions;
      return Promise.resolve();
    },
    stored: () => stored,
  };
}

describe('store: createOfflineActionsStore', () => {
  it('should hydrate queued actions from storage', async () => {
    const action = buildOfflineAction();
    const store = createOfflineActionsStore(createMemoryStorage([action]));

    await store.refresh();

    expect(store.current()).toEqual([action]);
  });

  it('should append and persist enqueued actions', async () => {
    const storage = createMemoryStorage();
    const store = createOfflineActionsStore(storage);

    const first = buildOfflineAction({ keys: ['movie:1'] });
    const second = buildOfflineAction({ keys: ['movie:2'] });
    await store.enqueue(first);
    await store.enqueue(second);

    expect(store.current()).toEqual([first, second]);
    expect(storage.stored()).toEqual([first, second]);
  });

  it('should supersede an action with the same domain and keys', async () => {
    const store = createOfflineActionsStore(createMemoryStorage());

    const add = buildOfflineAction({ endpoint: 'history:add' });
    const remove = buildOfflineAction({
      endpoint: 'history:remove',
      queuedAt: 2,
    });
    await store.enqueue(add);
    await store.enqueue(remove);

    expect(store.current()).toEqual([remove]);
  });

  it('should keep actions from other domains for the same keys', async () => {
    const store = createOfflineActionsStore(createMemoryStorage());

    const watch = buildOfflineAction({ endpoint: 'history:add' });
    const rate = buildOfflineAction({
      endpoint: 'rating:add',
      body: { movies: [{ ids: { trakt: 1 }, rating: 8 }] },
      invalidations: ['invalidate:rated:movie'],
    });
    await store.enqueue(watch);
    await store.enqueue(rate);

    expect(store.current()).toEqual([watch, rate]);
  });

  it('should keep actions with a different key set in the same domain', async () => {
    const store = createOfflineActionsStore(createMemoryStorage());

    const single = buildOfflineAction({ keys: ['movie:1'] });
    const bulk = buildOfflineAction({ keys: ['movie:1', 'movie:2'] });
    await store.enqueue(single);
    await store.enqueue(bulk);

    expect(store.current()).toEqual([single, bulk]);
  });

  it('should remove actions by id', async () => {
    const storage = createMemoryStorage();
    const store = createOfflineActionsStore(storage);

    const first = buildOfflineAction({ keys: ['movie:1'] });
    const second = buildOfflineAction({ keys: ['movie:2'] });
    await store.enqueue(first);
    await store.enqueue(second);

    await store.remove([first.id]);

    expect(store.current()).toEqual([second]);
    expect(storage.stored()).toEqual([second]);
  });

  it('should pick up external storage writes on refresh', async () => {
    const storage = createMemoryStorage();
    const store = createOfflineActionsStore(storage);

    const external = buildOfflineAction();
    await storage.write([external]);
    await store.refresh();

    expect(store.current()).toEqual([external]);
  });

  it('should keep accepting mutations after a storage failure', async () => {
    const storage = createMemoryStorage();
    const failOnce = {
      ...storage,
      write: vi.fn()
        .mockRejectedValueOnce(new Error('quota exceeded'))
        .mockImplementation(storage.write),
    };
    const store = createOfflineActionsStore(failOnce);

    const dropped = buildOfflineAction({ keys: ['movie:1'] });
    const queued = buildOfflineAction({ keys: ['movie:2'] });
    await store.enqueue(dropped);
    await store.enqueue(queued);

    expect(store.current()).toEqual([dropped, queued]);
    expect(storage.stored()).toEqual([dropped, queued]);
  });
});
