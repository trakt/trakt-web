import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSentimentAnalysis } from '../../_internal/mapToSentimentAnalyis.ts';
import { toMediaInfoPath } from '../../_internal/toMediaInfoPath.ts';
import { SentimentAnalysisSchema } from '../../models/SentimentAnalysis.ts';
import type { SentimentResponse } from '../../models/SentimentResponse.ts';

type ShowSentimentParams = {
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

const showSentimentRequest = async (
  { fetch, slug, locale }: ShowSentimentParams,
) => {
  const response = await rawApiFetch(
    {
      fetch,
      path: toMediaInfoPath({ type: 'show', slug, infoType: 0, locale }),
    },
  );

  return response.ok
    ? {
      body: await response.json() as SentimentResponse,
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const showSentimentQuery = defineQuery({
  key: 'showSentiment',
  invalidations: [],
  dependencies: (params) => [params.slug, params.locale],
  request: showSentimentRequest,
  mapper: (response) => mapToSentimentAnalysis(response.body),
  schema: SentimentAnalysisSchema.nullish(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
