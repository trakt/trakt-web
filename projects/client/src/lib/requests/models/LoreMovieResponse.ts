import { z } from 'zod';

export const LoreMovieResponseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  year: z.number().nullish(),
  poster: z.string().nullish(),
});

export type LoreMovieResponse = z.infer<typeof LoreMovieResponseSchema>;
