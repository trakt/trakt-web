import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';

export const SeasonSchema = z.object({
  id: z.number(),
  key: z.string(),
  number: z.number(),
  episodes: z.object({
    count: z.number(),
  }),
  poster: z.object({
    url: ImageUrlsSchema,
  }),
});
export type Season = z.infer<typeof SeasonSchema>;
