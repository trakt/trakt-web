import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import {
  mapToTrivia,
  mapToTriviaSummary,
} from '../../_internal/mapToTrivia.ts';
import { MediaTriviaSchema } from '../../models/MediaTrivia.ts';
import { type TriviaResponse } from '../../models/TriviaResponse.ts';

type MovieTriviaParams = { slug: string } & ApiParams;

const movieTriviaRequest = async (
  { fetch, slug }: MovieTriviaParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/media/movie/${slug}/info/5/version/1` },
  );

  const body = response.ok ? await response.json() : { summary: [], items: [] };

  return {
    body: body as TriviaResponse,
    status: 200,
  };
};

export const movieTriviaQuery = defineQuery({
  key: 'movieTrivia',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieTriviaRequest,
  mapper: (response) => ({
    items: response.body.items.map((entry) =>
      mapToTrivia('movie_trivia', entry)
    ),
    summary: mapToTriviaSummary('movie_trivia', response.body.summary),
  }),
  schema: z.object({
    items: MediaTriviaSchema.array(),
    summary: MediaTriviaSchema,
  }),
  ttl: time.hours(3),
});
