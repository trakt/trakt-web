import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PersonSummarySchema } from '$lib/requests/models/PersonSummary.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToPersonSummary } from '../../_internal/mapToPersonSummary.ts';

type PersonSummaryParams = { slug: string } & ApiParams;

const peopleSummaryRequest = (
  { fetch, slug }: PersonSummaryParams,
) =>
  api({ fetch })
    .people
    .summary({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    });

export const peopleSummaryQuery = defineQuery({
  key: 'peopleSummary:v2',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: peopleSummaryRequest,
  mapper: (response) => mapToPersonSummary(response.body),
  schema: PersonSummarySchema,
  ttl: time.days(30),
});
