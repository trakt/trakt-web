import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';

export const EpisodeProgressEntrySchema = EpisodeEntrySchema.merge(z.object({
  total: z.number(),
  completed: z.number(),
  remaining: z.number(),
  minutesLeft: z.number(),
  isLatestAired: z.boolean(),
  /*
    The user's furthest watched episode - "what you saw last". Only the show
    progress query populates it; up-next entries leave it unset. Kept light:
    anything richer than the recap line belongs in the episode drawer.
  */
  lastEpisode: z.object({
    season: z.number(),
    number: z.number(),
    title: z.string(),
    overview: z.string(),
  }).nullish(),
}));
export type EpisodeProgressEntry = z.infer<typeof EpisodeProgressEntrySchema>;
