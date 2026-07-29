import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { mapToTrivia } from '../../_internal/mapToTrivia.ts';
import { toMediaInfoPath } from '../../_internal/toMediaInfoPath.ts';
import { MediaTriviaSchema } from '../../models/MediaTrivia.ts';
import { type TriviaResponse } from '../../models/TriviaResponse.ts';

type ShowTriviaParams = { slug: string; locale: AvailableLocale } & ApiParams;

const showTriviaRequest = async (
  { fetch, slug, locale }: ShowTriviaParams,
) => {
  const response = await rawApiFetch(
    {
      fetch,
      path: toMediaInfoPath({ type: 'show', slug, infoType: 5, locale }),
    },
  );

  const body = response.ok ? await response.json() : { summary: [], items: [] };

  return {
    body: body as TriviaResponse,
    status: 200,
  };
};

export const showTriviaQuery = defineQuery({
  key: 'showTrivia',
  invalidations: [],
  dependencies: (params) => [params.slug, params.locale],
  request: showTriviaRequest,
  mapper: (response) => ({
    items: response.body.items.map((entry) =>
      mapToTrivia('show_trivia', entry)
    ),
    summary: response.body.summary,
  }),
  schema: z.object({
    items: MediaTriviaSchema.array(),
    summary: z.string().array(),
  }),
  ttl: time.hours(3),
});
