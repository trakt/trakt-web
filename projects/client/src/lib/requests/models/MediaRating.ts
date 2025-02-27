import { HttpsUrlSchema } from '$lib/requests/models/HttpsUrlSchema.ts';
import { z } from 'zod';

export const MediaRatingSchema = z.object({
  trakt: z.object({
    rating: z.number(),
    votes: z.number(),
    distribution: z.record(
      z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
      z.number(),
    ),
  }),
  rotten: z.object({
    critic: z.number(),
    audience: z.number().nullable(),
    url: HttpsUrlSchema.nullish(),
  }).optional(),
  imdb: z.object({
    rating: z.number(),
    votes: z.number(),
    url: HttpsUrlSchema.nullish(),
  }).optional(),
});

export type MediaRating = z.infer<typeof MediaRatingSchema>;
