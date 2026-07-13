import { z } from 'zod';

export const UserStatsSchema = z.object({
  playCount: z.number(),
  minuteCount: z.number(),
  movieCount: z.number(),
  showCount: z.number(),
  episodeCount: z.number(),
  commentCount: z.number(),
  ratingCount: z.number(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;
