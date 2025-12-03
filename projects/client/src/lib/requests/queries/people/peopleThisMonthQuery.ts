import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { PersonResponse } from '@trakt/api';
import z from 'zod';
import { mapToPersonSummary } from '../../_internal/mapToPersonSummary.ts';
import { PersonSummarySchema } from '../../models/PersonSummary.ts';

const PersonResultSchema = z.object({
  type: z.literal('people'),
  items: PersonSummarySchema.array(),
});

export type PeopleThisMonthResult = z.infer<typeof PersonResultSchema>;

const peopleThisMonthRequest = async (
  { fetch = globalThis.fetch }: ApiParams,
) => {
  const response = await fetch('https://apiz.trakt.tv/people/this_month', {
    headers: {
      'trakt-api-version': '2',
      'trakt-api-key': TRAKT_CLIENT_ID,
      'Content-Type': 'application/json',
    },
  });

  const body = response.ok ? await response.json() : [];

  return {
    body: body as PersonResponse[],
    status: response.status,
  };
};

export const peopleThisMonthQuery = defineQuery({
  key: 'peopleThisMonth:v2',
  invalidations: [],
  dependencies: () => [],
  request: peopleThisMonthRequest,
  mapper: (response) => ({
    type: 'people' as const,
    items: response.body.map(mapToPersonSummary),
  }),
  schema: PersonResultSchema,
  ttl: time.days(1),
});
