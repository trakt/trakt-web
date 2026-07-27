import { browser } from '$app/environment';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import {
  type ClientAuthState,
  resolveClientAuthState,
} from './resolveClientAuthState.ts';
import { resolveOidcAuthority } from './resolveOidcAuthority.ts';

// Null where there is no storage to read (SSR, bots, restricted engines),
// which is the caller's signal to fall back to the server value.
export function resolveBrowserAuthState(): ClientAuthState | null {
  if (!browser) {
    return null;
  }

  return resolveClientAuthState({
    store: safeLocalStorage,
    authority: resolveOidcAuthority(),
    clientId: TRAKT_CLIENT_ID,
  });
}
