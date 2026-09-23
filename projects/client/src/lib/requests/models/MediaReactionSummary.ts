import { z } from 'zod';
import { ReactionMetricSchema } from './ReactionMetric.ts';

// Aggregate sentiment breakdown for a single movie or show. The media it
// belongs to is implied by the query key, so it is not duplicated here.
//
// Named for the media rather than plain `ReactionSummary`, which the comment
// stack already owns for a different shape - the two taxonomies are separate
// on purpose and their summaries must not read as interchangeable.
export const MediaReactionSummarySchema = z.object({
  totalCount: z.number(),
  metrics: z.array(ReactionMetricSchema),
});

export type MediaReactionSummary = z.infer<typeof MediaReactionSummarySchema>;
