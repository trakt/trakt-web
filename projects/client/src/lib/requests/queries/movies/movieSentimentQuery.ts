import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSentimentAnalysis } from '../../_internal/mapToSentimentAnalyis.ts';
import { SentimentAnalysisSchema } from '../../models/SentimentAnalysis.ts';
import type { SentimentResponse } from '../../models/SentimentResponse.ts';

type MovieSentimentParams = { slug: string } & ApiParams;

const movieSentimentRequest = async (
  { fetch, slug }: MovieSentimentParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: `/v3/media/movie/${slug}/info/0/version/1` },
  );

  return response.ok
    ? {
      body: await response.json() as SentimentResponse,
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const movieSentimentQuery = defineQuery({
  key: 'movieSentiment',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieSentimentRequest,
  mapper: (response) => mapToSentimentAnalysis(response.body),
  schema: SentimentAnalysisSchema.nullish(),
  ttl: time.hours(3),
});
