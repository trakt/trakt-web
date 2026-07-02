import { rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';

const MovieMatchIdsSchema = z.object({
  trakt: z.number(),
  slug: z.string().nullish(),
  imdb: z.string().nullish(),
  tmdb: z.number().nullish(),
});

const MovieMatchCandidateSchema = z.object({
  title: z.string(),
  year: z.number().nullish(),
  score: z.number().nullish(),
  poster: z.string().nullish(),
  ids: MovieMatchIdsSchema,
});

const MovieMatchResponseSchema = z.object({
  results: z.object({
    index: z.number(),
    status: z.enum(['matched', 'ambiguous', 'not_found', 'invalid']),
    match: MovieMatchCandidateSchema.nullish(),
    candidates: MovieMatchCandidateSchema.array().nullish(),
  }).array(),
});

export type MovieMatchQuery = {
  index: number;
  title: string;
  year?: number;
};

export type MovieMatchResult = z.infer<
  typeof MovieMatchResponseSchema
>['results'][number];

export async function matchMovies(
  queries: ReadonlyArray<MovieMatchQuery>,
): Promise<MovieMatchResult[]> {
  if (queries.length === 0) return [];

  const response = await rawApiFetch({
    path: '/v3/search/match/movies',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movies: queries }),
    },
  });

  if (!response.ok) return [];

  return MovieMatchResponseSchema.parse(await response.json()).results;
}
