import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';
import { LoreMovieSchema } from './LoreMovie.ts';
import { MovieLoreKindSchema } from './MovieLoreKind.ts';
import { MovieLoreVerdictSchema } from './MovieLoreVerdict.ts';

export const MovieLoreSchema = z.object({
  kind: MovieLoreKindSchema,
  setup: z.array(z.string()),
  watchFirst: z
    .object({
      verdict: MovieLoreVerdictSchema,
      note: z.string(),
      movies: z.array(LoreMovieSchema),
    })
    .nullable(),
  earlier: z.array(LoreMovieSchema),
  attribution: HttpsUrlSchema.nullable(),
  locked: z
    .object({
      lore: z.number(),
      previously: z.number(),
    })
    .nullable(),
  lore: z.array(z.string()),
  previously: z.array(
    z.object({
      movie: LoreMovieSchema,
      summary: z.string(),
    }),
  ),
});

export type MovieLore = z.infer<typeof MovieLoreSchema>;
