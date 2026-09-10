import { onlineManager } from '@tanstack/query-core';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { onlineStatusStore } from './onlineStatusStore.ts';

function setNavigatorOnline(isOnline: boolean) {
  Object.defineProperty(globalThis.navigator, 'onLine', {
    value: isOnline,
    configurable: true,
  });
}

async function bootStore() {
  vi.resetModules();

  const [store, core] = await Promise.all([
    import('./onlineStatusStore.ts'),
    import('@tanstack/query-core'),
  ]);

  return { store: store.onlineStatusStore, manager: core.onlineManager };
}

describe('store: onlineStatusStore', () => {
  afterEach(() => {
    setNavigatorOnline(true);
    onlineManager.setOnline(true);
    vi.resetModules();
  });

  it('should report the current online state on subscribe', async () => {
    onlineManager.setOnline(false);

    expect(onlineStatusStore.isOnline()).toBe(false);
    expect(await firstValueFrom(onlineStatusStore.isOnline$)).toBe(false);
  });

  it('should emit when connectivity comes back', () => {
    onlineManager.setOnline(false);

    const states: boolean[] = [];
    const subscription = onlineStatusStore.isOnline$
      .subscribe((isOnline) => states.push(isOnline));

    onlineManager.setOnline(true);
    subscription.unsubscribe();

    expect(states).to.deep.equal([false, true]);
  });

  it('should report offline when the tab boots without a connection', async () => {
    setNavigatorOnline(false);

    const { store } = await bootStore();

    expect(store.isOnline()).toBe(false);
    expect(await firstValueFrom(store.isOnline$)).toBe(false);
  });

  it('should emit when connectivity returns after booting offline', async () => {
    setNavigatorOnline(false);

    const { store, manager } = await bootStore();

    const states: boolean[] = [];
    const subscription = store.isOnline$
      .subscribe((isOnline) => states.push(isOnline));

    manager.setOnline(true);
    subscription.unsubscribe();

    expect(states).to.deep.equal([false, true]);
  });
});
