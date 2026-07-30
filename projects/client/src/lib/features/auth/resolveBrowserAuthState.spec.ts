import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { deriveStandardAuthority } from './deriveStandardAuthority.ts';
import { oidcUserStoreKey } from './oidcUserStoreKey.ts';
import { resolveBrowserAuthState } from './resolveBrowserAuthState.ts';
import { resolveOidcAuthority } from './resolveOidcAuthority.ts';

const legacyKey = oidcUserStoreKey({
  authority: deriveStandardAuthority(),
  clientId: TRAKT_CLIENT_ID,
});

const currentKey = oidcUserStoreKey({
  authority: resolveOidcAuthority(),
  clientId: TRAKT_CLIENT_ID,
});

describe('resolveBrowserAuthState', () => {
  beforeEach(() => {
    globalThis.localStorage.removeItem(legacyKey);
    globalThis.localStorage.removeItem(currentKey);
  });

  it('should report no session when storage is empty', () => {
    expect(resolveBrowserAuthState()?.hasSession).toBe(false);
  });

  it('should resolve a session stored under the current authority', () => {
    globalThis.localStorage.setItem(currentKey, JSON.stringify(OidcUserMock));

    expect(resolveBrowserAuthState()?.hasSession).toBe(true);
  });

  it('should resolve a session still stored under the pre-migration authority', () => {
    globalThis.localStorage.setItem(legacyKey, JSON.stringify(OidcUserMock));

    // Reading before the port ran would report no session and paint the public
    // shell at a viewer who is in fact signed in.
    expect(resolveBrowserAuthState()?.hasSession).toBe(true);
  });
});
