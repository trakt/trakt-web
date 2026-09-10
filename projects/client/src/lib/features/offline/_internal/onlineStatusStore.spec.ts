import { onlineManager } from '@tanstack/query-core';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { onlineStatusStore } from './onlineStatusStore.ts';

describe('store: onlineStatusStore', () => {
  afterEach(() => {
    onlineManager.setOnline(true);
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
});
