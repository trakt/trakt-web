import { z } from 'zod';
import { LoreMovieResponseSchema } from './LoreMovieResponse.ts';
import { MovieLoreKindSchema } from './MovieLoreKind.ts';
import { MovieLoreVerdictSchema } from './MovieLoreVerdict.ts';

export const MovieLoreResponseSchema = z.object({
  kind: MovieLoreKindSchema,
  setup: z.array(z.string()),
  watchFirst: z
    .object({
      verdict: MovieLoreVerdictSchema,
      note: z.string(),
      movies: z.array(LoreMovieResponseSchema),
    })
    .nullish(),
  earlier: z.array(LoreMovieResponseSchema),
  attribution: z.string().nullish(),
  locked: z
    .object({
      lore: z.number(),
      previously: z.number(),
    })
    .nullish(),
  lore: z.array(z.string()).nullish(),
  previously: z
    .array(
      z.object({
        movie: LoreMovieResponseSchema,
        summary: z.string(),
      }),
    )
    .nullish(),
});

export type MovieLoreResponse = z.infer<typeof MovieLoreResponseSchema>;
