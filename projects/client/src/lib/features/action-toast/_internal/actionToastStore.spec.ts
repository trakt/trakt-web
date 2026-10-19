import { beforeEach, describe, expect, it } from 'vitest';
import type { ActionToast } from '../models/ActionToast.ts';
import { actionToastStore } from './actionToastStore.ts';

function currentToast() {
  let value: ActionToast | null = null;
  const sub = actionToastStore.subscribe((v) => (value = v));
  sub.unsubscribe();
  return value as ActionToast | null;
}

describe('store: actionToastStore', () => {
  beforeEach(() => {
    actionToastStore.dismiss();
  });

  it('should dismiss the toast matching the given id', () => {
    const id = actionToastStore.notify({ message: 'first' });

    actionToastStore.dismiss(id);

    expect(currentToast()).toBeNull();
  });

  it('should keep a newer toast when dismissing an older id', () => {
    const olderId = actionToastStore.notify({ message: 'first' });
    actionToastStore.notify({ message: 'second' });

    actionToastStore.dismiss(olderId);

    expect(currentToast()?.message).toBe('second');
  });
});
