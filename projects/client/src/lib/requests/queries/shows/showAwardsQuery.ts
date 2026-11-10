import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { TitleAwardResponse } from '@trakt/api';
import { mapToAwardEntry } from '../../_internal/mapToAwardEntry.ts';
import { AwardEntrySchema } from '../../models/AwardEntry.ts';

type ShowAwardsParams = {
  slug: string;
} & ApiParams;

const showAwardsRequest = async ({ fetch, slug }: ShowAwardsParams) => {
  const response = await api({ fetch }).shows.awards({
    params: {
      id: slug,
    },
  });

  if (response.status === 404) {
    return {
      ...response,
      status: 200 as const,
      body: [] as TitleAwardResponse[],
    };
  }

  return response;
};

export const showAwardsQuery = defineQuery({
  key: 'showAwards',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showAwardsRequest,
  mapper: (response) => response.body.map(mapToAwardEntry),
  schema: AwardEntrySchema.array(),
  ttl: time.minutes(30),
});
