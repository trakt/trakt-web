import { type UserManager } from 'oidc-client-ts';
import { BehaviorSubject } from 'rxjs';

const userManager = new BehaviorSubject<UserManager | null>(null);

export function getUserManager() {
  // FIXME: assertDefined this when fully migrated to oidc-client-ts
  return userManager.value;
}

export function setUserManager(manager: UserManager | null) {
  userManager.next(manager);
}
