import type { z } from 'zod';
import type { UserId } from './UserId.ts';

export type ClientRecordOptions<E> = {
  entry: z.ZodType<E>;
  mergeEntry?: (local: E, remote: E) => E;
  isExpired?: (entry: E, now: number) => boolean;
  legacyStorageKey?: string;
  fromLegacy?: (legacy: unknown, userId: UserId) => unknown;
};
