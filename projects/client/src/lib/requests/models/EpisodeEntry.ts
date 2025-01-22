import { genreOptionSchema } from '@trakt/api';
import { z } from 'zod';
import { EpisodeTypeSchema } from './EpisodeType.ts';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const EpisodeEntrySchema = z.object({
  id: z.number(),
  season: z.number(),
  number: z.number(),
  title: z.string(),
  overview: z.string(),
  cover: z.object({
    url: HttpsUrlSchema.nullish(),
  }),
  genres: genreOptionSchema.array(),
  airDate: z.date(),
  type: EpisodeTypeSchema,
  runtime: z.number(),
  year: z.number(),
  certification: z.null().optional(),
});

export type EpisodeEntry = z.infer<typeof EpisodeEntrySchema>;
