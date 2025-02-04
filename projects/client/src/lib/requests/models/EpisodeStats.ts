import { z } from 'zod';

export const EpisodeStatsSchema = z.object({
  watchers: z.number(),
  plays: z.number(),
  collectors: z.number(),
  comments: z.number(),
  lists: z.number(),
});

export type EpisodeStats = z.infer<typeof EpisodeStatsSchema>;
