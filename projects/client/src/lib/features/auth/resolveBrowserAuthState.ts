import { browser } from '$app/environment';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { deriveStandardAuthority } from './deriveStandardAuthority.ts';
import { portWorkerAuthSession } from './portWorkerAuthSession.ts';
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

  const authority = resolveOidcAuthority();

  // Migrate before reading, not in `initializeUserManager`'s `onMount`. A
  // session still under the pre-migration authority key reads as "no session",
  // which downgrades an authorized viewer to the public shell until the manager
  // resolves - the flash this whole path exists to remove.
  portWorkerAuthSession({
    store: safeLocalStorage,
    clientId: TRAKT_CLIENT_ID,
    fromAuthority: deriveStandardAuthority(),
    toAuthority: authority,
  });

  return resolveClientAuthState({
    store: safeLocalStorage,
    authority,
    clientId: TRAKT_CLIENT_ID,
  });
}
