import { genreOptionSchema } from '@trakt/api';
import { z } from 'zod';
import { EpisodeTypeSchema } from './EpisodeType.ts';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';
import { PostCreditsSchema } from './PostCreditsSchema.ts';

const BaseEpisodeEntrySchema = z.object({
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
  postCredits: PostCreditsSchema.array(),
  rating: z.number().nullish(),
});

// FIXME: discriminated union; only for computed types
export const EpisodeEntrySchema = BaseEpisodeEntrySchema.extend({
  episodes: BaseEpisodeEntrySchema.array().nullish(),
});

export type EpisodeEntry = z.infer<typeof EpisodeEntrySchema>;
