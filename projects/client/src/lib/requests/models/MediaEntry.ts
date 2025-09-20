import { genreOptionSchema } from '@trakt/api';
import { z } from 'zod';
import { CreditCookieSchema } from './CreditCookieSchema.ts';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';
import { MediaStatusSchema } from './MediaStatus.ts';
import { MediaTypeSchema } from './MediaType.ts';

const ImageUrlsSchema = z.object({
  medium: HttpsUrlSchema,
  thumb: HttpsUrlSchema,
});

export const MediaEntrySchema = z.object({
  id: z.number(),
  slug: z.string(),
  type: MediaTypeSchema,
  year: z.number().nullish(),
  runtime: z.number(),
  title: z.string(),
  originalTitle: z.string().nullish(),
  tagline: z.string(),
  country: z.string().nullish(),
  languages: z.array(z.string()).nullish(),
  poster: z.object({
    url: ImageUrlsSchema,
  }),
  cover: z.object({
    url: ImageUrlsSchema,
  }),
  logo: z.object({
    url: ImageUrlsSchema,
  }),
  thumb: z.object({
    url: HttpsUrlSchema,
  }),
  genres: genreOptionSchema.array(),
  status: MediaStatusSchema,
  overview: z.string(),
  trailer: z.string(),
  airDate: z.date(),
  certification: z.string().nullish(),
  votes: z.number(),
  colors: z.tuple([z.string(), z.string()]).optional(),
  plexSlug: z.string().nullish(),
  creditCookies: CreditCookieSchema.array(),
  rating: z.number().nullish(),
});

export type MediaEntry = z.infer<typeof MediaEntrySchema>;
