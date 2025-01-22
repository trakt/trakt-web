import { z } from 'zod';

export const EpisodeCountSchema = z.object({
  episode: z.object({
    count: z.number(),
  }),
});
export type EpisodeCount = z.infer<typeof EpisodeCountSchema>;
