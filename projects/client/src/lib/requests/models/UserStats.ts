import { z } from 'zod';

export const RatingDistributionSchema = z.object({
  1: z.number(),
  2: z.number(),
  3: z.number(),
  4: z.number(),
  5: z.number(),
  6: z.number(),
  7: z.number(),
  8: z.number(),
  9: z.number(),
  10: z.number(),
});

export const UserStatsSchema = z.object({
  movies: z.object({
    plays: z.number(),
    watched: z.number(),
    minutes: z.number(),
    ratings: z.number(),
    comments: z.number(),
  }),
  shows: z.object({
    watched: z.number(),
    ratings: z.number(),
    comments: z.number(),
  }),
  seasons: z.object({
    ratings: z.number(),
    comments: z.number(),
  }),
  episodes: z.object({
    plays: z.number(),
    watched: z.number(),
    minutes: z.number(),
    ratings: z.number(),
    comments: z.number(),
  }),
  network: z.object({
    followers: z.number(),
    following: z.number(),
  }),
  ratings: z.object({
    total: z.number(),
    distribution: RatingDistributionSchema,
  }),
  progress: z.object({
    started: z.number(),
    finished: z.number(),
    dropped: z.number(),
  }),
  lists: z.number(),
  totalMinutes: z.number(),
  totalPlays: z.number(),
});

export type RatingDistribution = z.infer<typeof RatingDistributionSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
