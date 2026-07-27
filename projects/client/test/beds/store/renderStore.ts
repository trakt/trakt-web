import { oidcUserStoreKey } from '$lib/features/auth/oidcUserStoreKey.ts';
import { resolveOidcAuthority } from '$lib/features/auth/resolveOidcAuthority.ts';
import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { isAuthorized } from '$test/beds/_internal/isAuthorized.ts';
import { render } from '@testing-library/svelte';
import StoreTestBed from './StoreTestBed.svelte';

const oidcSessionKey = () =>
  oidcUserStoreKey({
    authority: resolveOidcAuthority(),
    clientId: TRAKT_CLIENT_ID,
  });

export function setAuthorization(state: boolean) {
  isAuthorized.next(state);

  // `AuthProvider` reads the browser's audience from storage, not from its
  // prop, so the bed has to mirror the flag there too.
  if (!state) {
    globalThis.localStorage.removeItem(oidcSessionKey());
    return;
  }

  globalThis.localStorage.setItem(
    oidcSessionKey(),
    JSON.stringify(OidcUserMock),
  );
}

export function renderStore<T>(factory: () => T): Promise<T> {
  return new Promise((resolve) =>
    render(StoreTestBed, {
      props: { factory, output: (value: unknown) => resolve(value as T) },
    })
  );
}
