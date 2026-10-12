import type { z } from 'zod';
import type { ClientStateKey } from './ClientStateKey.ts';
import type { UserId } from './UserId.ts';

export type ClientStateDefinition<T> = {
  key: ClientStateKey;
  schema: z.ZodType<T>;
  empty: T;
  merge: (local: T, remote: T) => T;
  prune?: (value: T, now: number) => T;
  legacyStorageKey?: string;
  fromLegacy?: (legacy: unknown, userId: UserId) => unknown;
};
