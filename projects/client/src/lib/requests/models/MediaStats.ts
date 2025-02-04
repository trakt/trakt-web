import { z } from 'zod';
import { EpisodeStatsSchema } from './EpisodeStats.ts';

export const MediaStatsSchema = EpisodeStatsSchema.extend({
  votes: z.number(),
  favorited: z.number(),
});

export type MediaStats = z.infer<typeof MediaStatsSchema>;
