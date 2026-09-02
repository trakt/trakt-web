import type { User } from 'oidc-client-ts';
import { BehaviorSubject } from 'rxjs';
import type { createSilentRenewGuard } from '../createSilentRenewGuard.ts';

type SilentRenewGuard = ReturnType<typeof createSilentRenewGuard<User | null>>;

const silentRenewGuard = new BehaviorSubject<SilentRenewGuard | null>(null);

export function getSilentRenewGuard() {
  return silentRenewGuard.value;
}

export function setSilentRenewGuard(guard: SilentRenewGuard | null) {
  silentRenewGuard.next(guard);
}
