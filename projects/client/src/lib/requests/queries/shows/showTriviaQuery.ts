import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToTrivia } from '../../_internal/mapToTrivia.ts';
import { MediaTriviaSchema } from '../../models/MediaTrivia.ts';
import { type TriviaResponse } from '../../models/TriviaResponse.ts';

type ShowTriviaParams = { slug: string } & ApiParams;

const showTriviaRequest = async (
  { fetch, slug }: ShowTriviaParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/media/show/${slug}/info/1/version/1` },
  );

  const body = response.ok ? await response.json() : [];

  return {
    body: body as TriviaResponse[],
    status: response.status,
  };
};

export const showTriviaQuery = defineQuery({
  key: 'showSentiments',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showTriviaRequest,
  mapper: (response) =>
    response.body.map((entry, index) =>
      mapToTrivia(`show_trivia_${index}`, entry)
    ),
  schema: MediaTriviaSchema.array(),
  ttl: time.days(1),
});
