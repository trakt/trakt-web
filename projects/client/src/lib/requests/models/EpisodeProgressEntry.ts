import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';

export const EpisodeProgressEntrySchema = EpisodeEntrySchema.merge(z.object({
  total: z.number(),
  completed: z.number(),
  remaining: z.number(),
  minutesLeft: z.number(),
}));
export type EpisodeProgressEntry = z.infer<typeof EpisodeProgressEntrySchema>;
