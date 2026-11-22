import { beforeEach, describe, expect, it, vi } from 'vitest';

const store = new Map<string, string>();

vi.mock('$lib/utils/storage/safeStorage.ts', () => ({
  safeSessionStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  },
}));

const load = async () => {
  vi.resetModules();
  return (await import('./orientationPermissionSession.ts'))
    .orientationPermissionSession;
};

describe('util: orientationPermissionSession', () => {
  beforeEach(() => {
    store.clear();
  });

  it('should have no outcome before anything was decided', async () => {
    expect((await load()).read()).toBeNull();
  });

  it('should hand the outcome to every poster that mounts afterwards', async () => {
    const session = await load();
    session.write('granted');

    expect(session.read()).toBe('granted');
  });

  it('should survive a reload of the tab', async () => {
    (await load()).write('denied');

    expect((await load()).read()).toBe('denied');
  });

  it('should ignore a stored value it does not know', async () => {
    store.set('living-poster-tilt-outcome', 'maybe');

    expect((await load()).read()).toBeNull();
  });
});
