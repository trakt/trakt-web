import { z } from 'zod';

import { MediaStatusSchema } from './MediaStatus.ts';

const WatchedProgressEpisodeSchema = z.object({
  number: z.number(),
  completed: z.boolean(),
  lastWatchedAt: z.date().nullable(),
});

const WatchedProgressSeasonSchema = z.object({
  number: z.number(),
  title: z.string().nullable(),
  aired: z.number(),
  completed: z.number(),
  episodes: z.array(WatchedProgressEpisodeSchema),
});

const WatchedProgressNextEpisodeSchema = z.object({
  season: z.number(),
  number: z.number(),
  title: z.string(),
  id: z.number(),
  screenshot: z.string().nullable(),
});

export const WatchedProgressEntrySchema = z.object({
  key: z.string(),
  show: z.object({
    title: z.string(),
    year: z.number().nullable(),
    slug: z.string(),
    id: z.number(),
    airedEpisodes: z.number(),
    status: MediaStatusSchema,
    poster: z.object({
      medium: z.string(),
      thumb: z.string(),
    }),
    fanart: z.object({
      medium: z.string(),
      thumb: z.string(),
    }),
  }),
  aired: z.number(),
  completed: z.number(),
  plays: z.number().nullish(),
  percentage: z.number(),
  lastWatchedAt: z.date().nullable(),
  resetAt: z.date().nullable(),
  seasons: z.array(WatchedProgressSeasonSchema),
  nextEpisode: WatchedProgressNextEpisodeSchema.nullable(),
  lastEpisode: WatchedProgressNextEpisodeSchema.nullable(),
});

export type WatchedProgressEntry = z.infer<typeof WatchedProgressEntrySchema>;
export type WatchedProgressSeason = z.infer<typeof WatchedProgressSeasonSchema>;
export type WatchedProgressEpisode = z.infer<
  typeof WatchedProgressEpisodeSchema
>;
export type WatchedProgressNextEpisode = z.infer<
  typeof WatchedProgressNextEpisodeSchema
>;
