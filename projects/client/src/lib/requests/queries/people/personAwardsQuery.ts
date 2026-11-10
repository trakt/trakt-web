import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { PersonAwardResponse } from '@trakt/api';
import { mapToAwardEntry } from '../../_internal/mapToAwardEntry.ts';
import { AwardEntrySchema } from '../../models/AwardEntry.ts';

type PersonAwardsParams = {
  slug: string;
} & ApiParams;

const personAwardsRequest = async ({ fetch, slug }: PersonAwardsParams) => {
  const response = await api({ fetch }).people.awards({
    params: {
      id: slug,
    },
  });

  if (response.status === 404) {
    return {
      ...response,
      status: 200 as const,
      body: [] as PersonAwardResponse[],
    };
  }

  return response;
};

export const personAwardsQuery = defineQuery({
  key: 'personAwards',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: personAwardsRequest,
  mapper: (response) => response.body.map(mapToAwardEntry),
  schema: AwardEntrySchema.array(),
  ttl: time.minutes(30),
});
