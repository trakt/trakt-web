import { z } from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';
import { SubgenreSchema } from './RecommendationsResponse.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

export const RecommendationSourceSchema = z.union([
  z.object({
    id: z.number(),
    type: z.enum(['activity', 'favorite']),
    stars: z.number().nullable(),
    mediaType: z.literal('movie'),
    media: MovieEntrySchema,
  }),
  z.object({
    id: z.number(),
    type: z.enum(['activity', 'favorite']),
    stars: z.number().nullable(),
    mediaType: z.literal('show'),
    media: ShowEntrySchema,
  }),
  z.object({
    id: z.number(),
    type: z.literal('subgenre'),
    stars: z.number().nullable(),
    mediaType: z.literal('movie'),
    media: MovieEntrySchema,
    subgenres: z.array(SubgenreSchema),
  }),
  z.object({
    id: z.number(),
    type: z.literal('subgenre'),
    stars: z.number().nullable(),
    mediaType: z.literal('show'),
    media: ShowEntrySchema,
    subgenres: z.array(SubgenreSchema),
  }),
]);

export type RecommendationSource = z.infer<typeof RecommendationSourceSchema>;
