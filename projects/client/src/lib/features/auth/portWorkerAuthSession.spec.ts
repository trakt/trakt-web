import { describe, expect, it } from 'vitest';
import { portWorkerAuthSession } from './portWorkerAuthSession.ts';

const CLIENT_ID = 'cid';
const FROM = 'https://trakt.tv';
const TO = 'https://auth.trakt.tv';
const fromKey = `oidc.user:${FROM}:${CLIENT_ID}`;
const toKey = `oidc.user:${TO}:${CLIENT_ID}`;

function makeStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    store: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
      removeItem: (key: string) => void data.delete(key),
    },
  };
}

describe('portWorkerAuthSession', () => {
  it('moves the session from the old authority key to the new one', () => {
    const { store, data } = makeStore({ [fromKey]: 'SESSION' });

    const moved = portWorkerAuthSession({
      store,
      clientId: CLIENT_ID,
      fromAuthority: FROM,
      toAuthority: TO,
    });

    expect(moved).toBe(true);
    expect(data.get(toKey)).toBe('SESSION');
    expect(data.has(fromKey)).toBe(false);
  });

  it('no-ops when a session already exists on the new authority', () => {
    const { store, data } = makeStore({ [fromKey]: 'OLD', [toKey]: 'NEW' });

    const moved = portWorkerAuthSession({
      store,
      clientId: CLIENT_ID,
      fromAuthority: FROM,
      toAuthority: TO,
    });

    expect(moved).toBe(false);
    expect(data.get(toKey)).toBe('NEW');
    expect(data.get(fromKey)).toBe('OLD');
  });

  it('no-ops when there is no old session', () => {
    const { store } = makeStore();

    expect(
      portWorkerAuthSession({
        store,
        clientId: CLIENT_ID,
        fromAuthority: FROM,
        toAuthority: TO,
      }),
    ).toBe(false);
  });

  it('no-ops when authorities match (not on the beta host)', () => {
    const { store, data } = makeStore({ [fromKey]: 'SESSION' });

    const moved = portWorkerAuthSession({
      store,
      clientId: CLIENT_ID,
      fromAuthority: FROM,
      toAuthority: FROM,
    });

    expect(moved).toBe(false);
    expect(data.get(fromKey)).toBe('SESSION');
  });
});
