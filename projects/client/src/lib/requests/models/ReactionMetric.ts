import { z } from 'zod';
import { ReactionSentimentSchema } from './ReactionSentiment.ts';

export const ReactionMetricSchema = z.object({
  sentiment: ReactionSentimentSchema,
  count: z.number(),
  hasReacted: z.boolean().default(false),
});

export type ReactionMetric = z.infer<typeof ReactionMetricSchema>;
