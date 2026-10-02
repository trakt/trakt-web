import { z } from 'zod';
import { MediaReactionSchema } from './MediaReaction.ts';

export const MediaReactionSummarySchema = z.object({
  totalCount: z.number(),
  distribution: z.record(MediaReactionSchema, z.number()),
  top: z.array(MediaReactionSchema).readonly(),
});

export type MediaReactionSummary = z.infer<typeof MediaReactionSummarySchema>;
