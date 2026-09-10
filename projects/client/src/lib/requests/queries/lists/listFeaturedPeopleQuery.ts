import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToPersonSummary } from '$lib/requests/_internal/mapToPersonSummary.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PersonSummarySchema } from '$lib/requests/models/PersonSummary.ts';
import { time } from '$lib/utils/timing/time.ts';
import { personResponseSchema } from '@trakt/api';
import { z } from 'zod';

const FeaturedResponseSchema = z.object({
  featured: personResponseSchema.array().nullish(),
});

type ListFeaturedPeopleParams = { listId: number } & ApiParams;

const listFeaturedPeopleRequest = async (
  { fetch, listId }: ListFeaturedPeopleParams,
) => {
  // The SDK list schema does not expose the featured extension yet.
  const response = await rawApiFetch({
    fetch,
    path: `/lists/${listId}?extended=featured`,
  });

  return {
    status: response.status,
    body: response.ok
      ? FeaturedResponseSchema.parse(await response.json())
      : undefined,
  };
};

export const listFeaturedPeopleQuery = defineQuery({
  key: 'listFeaturedPeople',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: (params) => [params.listId],
  request: listFeaturedPeopleRequest,
  mapper: (response) => (response.body?.featured ?? []).map(mapToPersonSummary),
  schema: PersonSummarySchema.array(),
  ttl: time.minutes(30),
});
