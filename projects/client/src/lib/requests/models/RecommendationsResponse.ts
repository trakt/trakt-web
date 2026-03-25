import { movieResponseSchema, showResponseSchema } from '@trakt/api';
import { z } from 'zod';

const SourceSchema = z.union([
  z.object({
    id: z.number(),
    type: z.enum(['activity', 'favorite']),
    stars: z.number().nullable(),
    movie: movieResponseSchema,
  }),
  z.object({
    id: z.number(),
    type: z.enum(['activity', 'favorite']),
    stars: z.number().nullable(),
    show: showResponseSchema,
  }),
]);

export const RecommendationMovieItemSchema = z.object({
  movie: movieResponseSchema,
  score: z.coerce.number(),
  sources: z.array(SourceSchema),
});

export const RecommendationShowItemSchema = z.object({
  show: showResponseSchema,
  score: z.coerce.number(),
  sources: z.array(SourceSchema),
});

export const RecommendationsMovieResponseSchema = z.array(
  RecommendationMovieItemSchema,
);
export type RecommendationsMovieResponse = z.infer<
  typeof RecommendationsMovieResponseSchema
>;

export const RecommendationsShowResponseSchema = z.array(
  RecommendationShowItemSchema,
);
export type RecommendationsShowResponse = z.infer<
  typeof RecommendationsShowResponseSchema
>;

export const RecommendationsResponseSchema = z.array(
  z.union([RecommendationMovieItemSchema, RecommendationShowItemSchema]),
);
export type RecommendationsResponse = z.infer<
  typeof RecommendationsResponseSchema
>;
