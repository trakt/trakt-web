import { describe, expect, it } from 'vitest';
import { resolveClientAuthState } from './resolveClientAuthState.ts';

const CLIENT_ID = 'cid';
const AUTHORITY = 'https://auth.trakt.tv';
const KEY = `oidc.user:${AUTHORITY}:${CLIENT_ID}`;

const NOW = 1_000_000_000_000;

function makeStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
  };
}

function resolve(store: Pick<Storage, 'getItem'>) {
  return resolveClientAuthState({
    store,
    authority: AUTHORITY,
    clientId: CLIENT_ID,
    now: NOW,
  });
}

describe('resolveClientAuthState', () => {
  it('reports no session when storage is empty', () => {
    expect(resolve(makeStore())).toEqual({
      hasSession: false,
      isExpired: true,
      token: { value: null, expiresAt: null },
    });
  });

  it('reports no session when the entry is not valid JSON', () => {
    expect(resolve(makeStore({ [KEY]: 'not-json' })).hasSession).toBe(false);
  });

  it('reports no session when the entry carries no access token', () => {
    const stored = JSON.stringify({ expires_at: NOW / 1000 + 60 });

    expect(resolve(makeStore({ [KEY]: stored })).hasSession).toBe(false);
  });

  it('resolves a live session with its token', () => {
    const expiresAtSeconds = NOW / 1000 + 60;
    const stored = JSON.stringify({
      access_token: 'TOKEN',
      expires_at: expiresAtSeconds,
    });

    expect(resolve(makeStore({ [KEY]: stored }))).toEqual({
      hasSession: true,
      isExpired: false,
      token: { value: 'TOKEN', expiresAt: expiresAtSeconds * 1000 },
    });
  });

  it('flags an expired session while still reporting it', () => {
    const stored = JSON.stringify({
      access_token: 'TOKEN',
      expires_at: NOW / 1000 - 60,
    });

    const result = resolve(makeStore({ [KEY]: stored }));

    expect(result.hasSession).toBe(true);
    expect(result.isExpired).toBe(true);
  });

  it('treats a session without an expiry as live', () => {
    const stored = JSON.stringify({ access_token: 'TOKEN' });

    const result = resolve(makeStore({ [KEY]: stored }));

    expect(result.isExpired).toBe(false);
    expect(result.token.expiresAt).toBeNull();
  });
});
