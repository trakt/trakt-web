import { type UserManager } from 'oidc-client-ts';
import { get, writable } from 'svelte/store';

const userManager = writable<UserManager | null>(null);

export function getUserManager() {
  // FIXME: assertDefined this when fully migrated to oidc-client-ts
  return get(userManager);
}

export function setUserManager(manager: UserManager | null) {
  userManager.set(manager);
}
