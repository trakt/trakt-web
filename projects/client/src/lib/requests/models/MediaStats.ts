import { z } from 'zod';

export const MediaStatsSchema = z.object({
  watchers: z.number(),
  plays: z.number(),
  collectors: z.number(),
  comments: z.number(),
  lists: z.number(),
  votes: z.number(),
  favorited: z.number(),
});

export type MediaStats = z.infer<typeof MediaStatsSchema>;
