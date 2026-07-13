import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { filter, firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { offlineActionsStore } from './_internal/offlineActionsStore.ts';
import { useIsQueued } from './useIsQueued.ts';

async function drainQueue() {
  const ids = offlineActionsStore.current().map(({ id }) => id);
  await offlineActionsStore.remove(ids);
}

describe('store: useIsQueued', () => {
  afterEach(drainQueue);

  it('should be false with an empty queue', async () => {
    const { isQueued } = useIsQueued({ domain: 'history', keys: ['movie:1'] });

    expect(await firstValueFrom(isQueued)).toBe(false);
  });

  it('should be true when a queued action covers the keys', async () => {
    const { isQueued } = useIsQueued({ domain: 'history', keys: ['movie:1'] });

    await offlineActionsStore.enqueue(
      buildOfflineAction({ endpoint: 'history:add', keys: ['movie:1'] }),
    );

    expect(await firstValueFrom(isQueued.pipe(filter(Boolean)))).toBe(true);
  });

  it('should ignore queued actions from another domain', async () => {
    const { isQueued } = useIsQueued({ domain: 'history', keys: ['movie:1'] });

    await offlineActionsStore.enqueue(
      buildOfflineAction({ endpoint: 'watchlist:add', keys: ['movie:1'] }),
    );

    expect(await firstValueFrom(isQueued)).toBe(false);
  });

  it('should ignore queued actions for other keys', async () => {
    const { isQueued } = useIsQueued({ domain: 'history', keys: ['movie:1'] });

    await offlineActionsStore.enqueue(
      buildOfflineAction({ endpoint: 'history:add', keys: ['movie:2'] }),
    );

    expect(await firstValueFrom(isQueued)).toBe(false);
  });
});
