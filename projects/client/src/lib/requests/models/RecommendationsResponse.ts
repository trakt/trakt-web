import { movieResponseSchema, showResponseSchema } from '@trakt/api';
import { z } from 'zod';

export const SubgenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const SourceSchema = z.union([
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
  z.object({
    id: z.number(),
    type: z.literal('subgenre'),
    stars: z.number().nullable(),
    movie: movieResponseSchema,
    subgenres: z.array(SubgenreSchema),
  }),
  z.object({
    id: z.number(),
    type: z.literal('subgenre'),
    stars: z.number().nullable(),
    show: showResponseSchema,
    subgenres: z.array(SubgenreSchema),
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

export type Subgenre = z.infer<typeof SubgenreSchema>;
export type Source = z.infer<typeof SourceSchema>;
