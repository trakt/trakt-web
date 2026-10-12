import type { ClientStateKey } from '../models/ClientStateKey.ts';
import type { UserId } from '../models/UserId.ts';

const STORAGE_PREFIX = 'trakt-client-state';
const GUEST_SCOPE = 'guest';

export function toLocalStorageKey(
  { key, userId }: { key: ClientStateKey; userId: UserId },
): string {
  return `${STORAGE_PREFIX}:${key}:${userId === 0 ? GUEST_SCOPE : userId}`;
}
