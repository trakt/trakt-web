import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_SEARCH_LIMIT } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SearchResultResponse } from '@trakt/api';
import z from 'zod';
import { mapToPersonSummary } from '../../_internal/mapToPersonSummary.ts';
import type { CrewPosition } from '../../models/CrewPosition.ts';
import {
  type PersonSummary,
  PersonSummarySchema,
} from '../../models/PersonSummary.ts';
import { EXPERIMENTAL_PARAMS } from './_internal/constants.ts';
import { searchCancellationId } from './searchCancellationId.ts';

type SearchParams = {
  query: string;
} & ApiParams;

const PeopleSearchResultSchema = z.object({
  type: z.literal('people'),
  items: PersonSummarySchema.array(),
});

export type PeopleSearchResult = z.infer<typeof PeopleSearchResultSchema>;

function isGarbage(value?: PersonSummary): boolean {
  const relevantPositions: CrewPosition[] = [
    'directing',
    'acting',
    'writing',
    'production',
  ];

  return !relevantPositions.includes(value?.knownFor ?? '');
}

function mapToSearchResultEntry(
  item: SearchResultResponse[0],
): PersonSummary {
  const { type } = item;
  switch (type) {
    case 'person':
      return mapToPersonSummary(assertDefined(item.person));
    default:
      throw new Error(`Unsupported type for people search: ${type}`);
  }
}

const searchRequest = ({ query, fetch }: SearchParams) =>
  api({
    fetch,
    cancellable: true,
    cancellationId: searchCancellationId('person'),
  })
    .search
    .query({
      query: {
        query,
        extended: 'full,images',
        limit: DEFAULT_SEARCH_LIMIT,
        ...EXPERIMENTAL_PARAMS,
      },
      params: {
        type: 'person',
      },
    });

export const searchPeopleQuery = defineQuery({
  key: 'searchPeople',
  invalidations: [],
  dependencies: (params) => [params.query.toLowerCase().trim()],
  request: searchRequest,
  mapper: (response) => ({
    type: 'people' as const,
    items: response.body
      .map(mapToSearchResultEntry)
      .filter((value) => !isGarbage(value)),
  }),
  schema: PeopleSearchResultSchema,
  ttl: time.minutes(30),
  retry: 0,
});
