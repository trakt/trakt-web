import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const LoreMovieSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  year: z.number().nullable(),
  poster: HttpsUrlSchema.nullable(),
});

export type LoreMovie = z.infer<typeof LoreMovieSchema>;
