import { time } from '$lib/utils/timing/time.ts';
import { oidcUserStoreKey } from './oidcUserStoreKey.ts';
import type { Token } from './token/index.ts';

type StoredOidcUser = {
  access_token?: string;
  expires_at?: number;
};

type ResolveClientAuthStateProps = {
  store: Pick<Storage, 'getItem'>;
  authority: string;
  clientId: string;
  now?: number;
};

export type ClientAuthState = {
  hasSession: boolean;
  isExpired: boolean;
  token: Token;
};

const NO_SESSION: ClientAuthState = {
  hasSession: false,
  isExpired: true,
  token: { value: null, expiresAt: null },
};

function parseStoredUser(raw: string): StoredOidcUser | null {
  try {
    return JSON.parse(raw) as StoredOidcUser;
  } catch {
    return null;
  }
}

// `UserManager.getUser()` wraps this same `localStorage.getItem` in a promise,
// and that one-tick delay is long enough to paint the wrong audience.
export function resolveClientAuthState(
  { store, authority, clientId, now = Date.now() }: ResolveClientAuthStateProps,
): ClientAuthState {
  const raw = store.getItem(oidcUserStoreKey({ authority, clientId }));
  if (raw == null) {
    return NO_SESSION;
  }

  const user = parseStoredUser(raw);
  if (!user?.access_token) {
    return NO_SESSION;
  }

  const expiresAt = user.expires_at == null
    ? null
    : time.seconds(user.expires_at);

  return {
    hasSession: true,
    isExpired: expiresAt != null && expiresAt <= now,
    token: { value: user.access_token, expiresAt },
  };
}
