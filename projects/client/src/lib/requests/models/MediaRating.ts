import { HttpsUrlSchema } from '$lib/requests/models/HttpsUrlSchema.ts';
import { z } from 'zod';

// Shared shape for external audience ratings (TMDB, MyAnimeList, Letterboxd):
// a score, optional vote count and a link. The scale differs per source (see
// each field below), but the schema does not.
const ExternalRatingSchema = z.object({
  rating: z.number(),
  votes: z.number().nullish(),
  url: HttpsUrlSchema.nullish(),
});

export const MediaRatingSchema = z.object({
  trakt: z.object({
    rating: z.number(),
    votes: z.number(),
    distribution: z.record(
      z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
      z.number(),
    ),
  }).optional(),
  rotten: z.object({
    critic: z.number(),
    audience: z.number().nullish(),
    url: HttpsUrlSchema.nullish(),
  }).optional(),
  imdb: z.object({
    rating: z.number(),
    votes: z.number(),
    url: HttpsUrlSchema.nullish(),
  }).optional(),
  // TMDB audience rating on a 0-10 scale.
  tmdb: ExternalRatingSchema.optional(),
  // MyAnimeList audience rating on a 0-10 scale. Anime only.
  mal: ExternalRatingSchema.optional(),
  // Letterboxd audience rating on a 0-5 scale. Films only.
  letterboxd: ExternalRatingSchema.optional(),
});

export type MediaRating = z.infer<typeof MediaRatingSchema>;
