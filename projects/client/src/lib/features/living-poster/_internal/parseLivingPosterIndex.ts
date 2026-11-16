import z from 'zod';
import type { LivingPosterIndex } from '../models/LivingPosterIndex.ts';

const SUPPORTED_VERSION = 1;

const LivingPosterIndexSchema = z.object({
  v: z.literal(SUPPORTED_VERSION),
  movies: z.array(z.number()).nullish(),
  shows: z.array(z.number()).nullish(),
});

export function parseLivingPosterIndex(raw: unknown): LivingPosterIndex | null {
  const parsed = LivingPosterIndexSchema.safeParse(raw);
  if (!parsed.success) return null;

  return {
    movies: new Set(parsed.data.movies ?? []),
    shows: new Set(parsed.data.shows ?? []),
  };
}
