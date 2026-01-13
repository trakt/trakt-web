import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToTrivia } from '../../_internal/mapToTrivia.ts';
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
  key: 'movieSentiments',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieTriviaRequest,
  mapper: (response) =>
    response.body.items.map((entry) =>
      mapToTrivia(`movie_trivia_${entry.fact_id}`, entry)
    ),
  schema: MediaTriviaSchema.array(),
  ttl: time.days(1),
});
