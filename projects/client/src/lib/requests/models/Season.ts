import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';

export const SeasonSchema = z.object({
  id: z.number(),
  key: z.string(),
  number: z.number(),
  title: z.string().nullish(),
  episodes: z.object({
    count: z.number(),
    aired: z.number(),
  }),
  poster: z.object({
    url: ImageUrlsSchema,
  }).optional(),
  airDate: z.date(),
  overview: z.string().nullish(),
  rating: z.number().nullish(),
  network: z.string().nullish(),
  totalRuntime: z.number(),
});
export type Season = z.infer<typeof SeasonSchema>;
