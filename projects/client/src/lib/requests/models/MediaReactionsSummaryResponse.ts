import { z } from 'zod';

export const MediaReactionsSummaryResponseSchema = z.object({
  reaction_count: z.number(),
  user_count: z.number(),
  distribution: z.record(z.string(), z.number()),
});

export type MediaReactionsSummaryResponse = z.infer<
  typeof MediaReactionsSummaryResponseSchema
>;
