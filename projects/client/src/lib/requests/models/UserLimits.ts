import { z } from 'zod';

export const LimitsSchema = z.object({
  current: z.number(),
  free: z.number(),
  vip: z.number(),
});

export const UserLimitsSchema = z.object({
  history: LimitsSchema,
  ratings: LimitsSchema,
  watchlistItems: LimitsSchema,
  totalListItems: LimitsSchema,
  staticLists: LimitsSchema,
  dynamicLists: LimitsSchema,
  offlineLibrary: LimitsSchema,
  digitalLibrary: LimitsSchema,
  totalNotes: LimitsSchema,
});

export type UserLimits = z.infer<
  typeof UserLimitsSchema
>;
