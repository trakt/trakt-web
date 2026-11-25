import type { z } from 'zod';
import type { UserId } from './UserId.ts';

export type ClientValueOptions<T> = {
  schema: z.ZodType<T>;
  legacyStorageKey?: string;
  fromLegacy?: (legacy: unknown, userId: UserId) => unknown;
};
