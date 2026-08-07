import { z } from 'zod';
import { ReactionMetricSchema } from './ReactionMetric.ts';

// Aggregate sentiment breakdown for a single movie or show. The media it
// belongs to is implied by the query key, so it is not duplicated here.
export const ReactionSummarySchema = z.object({
  totalCount: z.number(),
  metrics: z.array(ReactionMetricSchema),
});

export type ReactionSummary = z.infer<typeof ReactionSummarySchema>;
