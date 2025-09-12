import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { PeopleSummaryResponse } from '@trakt/api';
import z from 'zod';
import { mapToPersonSummary } from '../../_internal/mapToPersonSummary.ts';

const peopleThisMonthRequest = async (
  { fetch = globalThis.fetch }: ApiParams,
) => {
  const response = await fetch('https://hd.trakt.tv/people/this_month', {
    headers: {
      'trakt-api-version': '2',
      'trakt-api-key': TRAKT_CLIENT_ID,
      'Content-Type': 'application/json',
    },
  });

  const body = response.ok ? await response.json() : [];

  return {
    body: body as PeopleSummaryResponse[],
    status: response.status,
  };
};

export const peopleThisMonthQuery = defineQuery({
  key: 'peopleThisMonth',
  invalidations: [],
  dependencies: () => [],
  request: peopleThisMonthRequest,
  mapper: (response) => ({
    type: 'people',
    items: response.body.map(mapToPersonSummary),
  }),
  schema: z.any(),
  ttl: time.days(1),
});
