type SessionStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

type PortWorkerAuthSessionProps = {
  store: SessionStore;
  clientId: string;
  fromAuthority: string;
  toAuthority: string;
};

const userStoreKey = (authority: string, clientId: string) =>
  `oidc.user:${authority}:${clientId}`;

// oidc-client-ts keys the stored session by authority. When the authority
// changes, the session is orphaned under the old key and the user is logged
// out; move it to the new key so the session is kept. Returns true if moved.
export function portWorkerAuthSession(
  { store, clientId, fromAuthority, toAuthority }: PortWorkerAuthSessionProps,
): boolean {
  if (fromAuthority === toAuthority) {
    return false;
  }

  const toKey = userStoreKey(toAuthority, clientId);
  if (store.getItem(toKey) != null) {
    return false;
  }

  const stored = store.getItem(userStoreKey(fromAuthority, clientId));
  if (stored == null) {
    return false;
  }

  store.setItem(toKey, stored);
  store.removeItem(userStoreKey(fromAuthority, clientId));
  return true;
}
