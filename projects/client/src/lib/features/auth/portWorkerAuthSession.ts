import { oidcUserStoreKey } from './oidcUserStoreKey.ts';

type SessionStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

type PortWorkerAuthSessionProps = {
  store: SessionStore;
  clientId: string;
  fromAuthority: string;
  toAuthority: string;
};

// oidc-client-ts keys the stored session by authority. When the authority
// changes, the session is orphaned under the old key and the user is logged
// out; move it to the new key so the session is kept. Returns true if moved.
export function portWorkerAuthSession(
  { store, clientId, fromAuthority, toAuthority }: PortWorkerAuthSessionProps,
): boolean {
  if (fromAuthority === toAuthority) {
    return false;
  }

  const toKey = oidcUserStoreKey({ authority: toAuthority, clientId });
  if (store.getItem(toKey) != null) {
    return false;
  }

  const fromKey = oidcUserStoreKey({ authority: fromAuthority, clientId });
  const stored = store.getItem(fromKey);
  if (stored == null) {
    return false;
  }

  store.setItem(toKey, stored);
  store.removeItem(fromKey);
  return true;
}
