import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PersonSummarySchema } from '$lib/requests/models/PersonSummary.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToPersonSummary } from '../../_internal/mapToPersonSummary.ts';

type PersonSummaryParams = {
  slug: string;
  locale: AvailableLocale;
} & ApiParams;

const peopleSummaryRequest = ({ fetch, slug, locale }: PersonSummaryParams) =>
  api({ fetch }).people.summary({
    params: {
      id: slug,
    },
    query: {
      extended: 'full,images,markdown',
      language: locale.toLowerCase(),
    },
  });

export const peopleSummaryQuery = defineQuery({
  key: 'peopleSummary:v3',
  invalidations: [],
  dependencies: (params) => [params.slug, params.locale],
  request: peopleSummaryRequest,
  mapper: (response) => mapToPersonSummary(response.body),
  schema: PersonSummarySchema,
  ttl: time.hours(12),
});
