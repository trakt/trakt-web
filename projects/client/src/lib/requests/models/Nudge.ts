import { z } from 'zod';

export const NudgeLimitSchema = z.enum([
  'watchlistItems',
  'totalListItems',
  'staticLists',
  'totalNotes',
]);

export type NudgeLimit = z.infer<typeof NudgeLimitSchema>;

export const NudgeSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('vip') }),
  z.object({
    type: z.literal('limit'),
    limit: NudgeLimitSchema,
    used: z.number(),
    total: z.number(),
  }),
]);

export type Nudge = z.infer<typeof NudgeSchema>;
