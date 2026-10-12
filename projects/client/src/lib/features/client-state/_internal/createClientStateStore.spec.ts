import type { ClientState } from '$lib/requests/models/ClientState.ts';
import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { ClientStateDefinition } from '../models/ClientStateDefinition.ts';
import type { ClientStateKey } from '../models/ClientStateKey.ts';
import { createClientStateStore } from './createClientStateStore.ts';

const definition: ClientStateDefinition<Record<string, string>> = {
  key: 'test_state' as unknown as ClientStateKey,
  legacyStorageKey: 'trakt-dismissed-banners',
  schema: z.record(z.string(), z.string()),
  empty: {},
  merge: (local, remote) => ({ ...remote, ...local }),
};

function setup(
  {
    userId = 42,
    remote = null,
    overrides = {},
  }: {
    userId?: number;
    remote?: ClientState | null;
    overrides?: Partial<ClientStateDefinition<Record<string, string>>>;
  } = {},
) {
  localStorage.clear();
  const save = vi.fn((_: { key: string; value: unknown }) =>
    Promise.resolve<unknown>(true)
  );
  const remote$ = new BehaviorSubject<ClientState | null>(remote);
  const userId$ = new BehaviorSubject(userId);
  const store = createClientStateStore({
    definition: { ...definition, ...overrides },
    userId: userId$,
    remote: remote$,
    save,
    storage: localStorage,
  });

  return { store, save, remote$, userId$ };
}

function flushUploads() {
  vi.advanceTimersByTime(time.seconds(1));
}

describe('createClientStateStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should take the server value once it arrives', async () => {
    const { store, save } = setup({
      remote: { test_state: { yir: '2026' } },
    });

    expect(await firstValueFrom(store.value)).to.deep.equal({ yir: '2026' });
    flushUploads();
    expect(save).not.toHaveBeenCalled();
  });

  it('should save updates after the server value arrived', () => {
    const { store, save } = setup({ remote: {} });

    store.update((current) => ({ ...current, welcome: 'dismissed' }));
    flushUploads();

    expect(save).toHaveBeenCalledWith({
      key: 'test_state',
      value: { welcome: 'dismissed' },
    });
    expect(localStorage.getItem('trakt-client-state:test_state:42'))
      .to.equal('{"welcome":"dismissed"}');
  });

  it('should batch quick updates into one save', () => {
    const { store, save } = setup({ remote: {} });

    store.update((current) => ({ ...current, welcome: 'dismissed' }));
    store.update((current) => ({ ...current, yir: '2026' }));
    flushUploads();

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({
      key: 'test_state',
      value: { welcome: 'dismissed', yir: '2026' },
    });
  });

  it('should hold updates until the server value arrives, then upload the merge', () => {
    const { store, save, remote$ } = setup();

    store.update(() => ({ welcome: 'dismissed' }));
    flushUploads();
    expect(save).not.toHaveBeenCalled();

    remote$.next({ test_state: { yir: '2026' } });
    flushUploads();

    expect(save).toHaveBeenCalledWith({
      key: 'test_state',
      value: { yir: '2026', welcome: 'dismissed' },
    });
  });

  it('should drop a pending save when the user changes', () => {
    const { store, save, userId$ } = setup({ remote: {} });

    store.update(() => ({ welcome: 'dismissed' }));
    userId$.next(7);
    flushUploads();

    expect(save).not.toHaveBeenCalled();
  });

  it('should prune values before keeping and saving them', () => {
    const { store, save } = setup({
      remote: { test_state: { old: 'gone', kept: 'yes' } },
      overrides: {
        prune: (value) =>
          Object.fromEntries(
            Object.entries(value).filter(([key]) => key !== 'old'),
          ),
      },
    });

    store.update((current) => ({ ...current, old: 'again' }));
    flushUploads();

    expect(save).toHaveBeenCalledWith({
      key: 'test_state',
      value: { kept: 'yes' },
    });
  });

  it('should not emit before the user is known', () => {
    localStorage.clear();
    const userId$ = new Subject<number>();
    const store = createClientStateStore({
      definition,
      userId: userId$,
      remote: new BehaviorSubject<ClientState | null>(null),
      save: vi.fn(() => Promise.resolve(true)),
      storage: localStorage,
    });
    localStorage.setItem(
      'trakt-client-state:test_state:42',
      '{"welcome":"dismissed"}',
    );
    const values: unknown[] = [];
    store.value.subscribe((value) => values.push(value));

    expect(values).to.deep.equal([]);

    userId$.next(42);

    expect(values).to.deep.equal([{ welcome: 'dismissed' }]);
  });

  it('should retry a failed save on the next server read', async () => {
    const { store, save, remote$ } = setup({ remote: {} });
    save.mockImplementationOnce(() => Promise.reject(new Error('offline')));

    store.update(() => ({ welcome: 'dismissed' }));
    flushUploads();
    await Promise.resolve();
    expect(save).toHaveBeenCalledTimes(1);

    remote$.next({});
    flushUploads();

    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenLastCalledWith({
      key: 'test_state',
      value: { welcome: 'dismissed' },
    });
  });

  it('should not save again once the server has the value', async () => {
    const { store, save, remote$ } = setup({ remote: {} });

    store.update(() => ({ welcome: 'dismissed' }));
    flushUploads();
    await Promise.resolve();

    remote$.next({ test_state: { welcome: 'dismissed' } });
    flushUploads();

    expect(save).toHaveBeenCalledTimes(1);
  });

  it('should never save for guests', () => {
    const { store, save } = setup({ userId: 0, remote: {} });

    store.update(() => ({ welcome: 'dismissed' }));
    flushUploads();

    expect(save).not.toHaveBeenCalled();
    expect(localStorage.getItem('trakt-client-state:test_state:guest'))
      .to.equal('{"welcome":"dismissed"}');
  });
});
