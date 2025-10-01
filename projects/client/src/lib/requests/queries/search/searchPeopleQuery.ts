import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams } from '$lib/requests/api.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SearchResultResponse } from '@trakt/api';
import z from 'zod';
import { mapToPersonSummary } from '../../_internal/mapToPersonSummary.ts';
import type { CrewPosition } from '../../models/CrewPosition.ts';
import {
  type PersonSummary,
  PersonSummarySchema,
} from '../../models/PersonSummary.ts';
import { getPeople } from './getPeople.ts';

type SearchParams = {
  query: string;
  config: TypesenseConfig;
} & ApiParams;

const PeopleSearchResultSchema = z.object({
  type: z.literal('people'),
  items: PersonSummarySchema.array(),
});

export type PeopleSearchResult = z.infer<typeof PeopleSearchResultSchema>;

function isGarbage(value: PersonSummary): boolean {
  const relevantPositions: CrewPosition[] = [
    'directing',
    'acting',
    'writing',
    'production',
  ];

  return !relevantPositions.includes(value?.knownFor ?? '');
}

function mapToSearchResultEntry(
  item: SearchResultResponse,
) {
  const { type } = item;
  switch (type) {
    case 'person':
      return {
        score: item.score,
        ...mapToPersonSummary(assertDefined(item.person)),
      };
    default:
      throw new Error(`Unsupported type for people search: ${type}`);
  }
}

const searchRequest = async (
  { query, config }: SearchParams,
) => {
  const response = await getPeople({
    query,
    config,
  });

  return response.map((item) => ({
    ...item,
    status: 200,
  }));
};

export const searchPeopleQuery = defineQuery({
  key: 'searchPeople',
  invalidations: [],
  dependencies: (params) => [params.query.toLowerCase().trim()],
  request: searchRequest,
  mapper: (response) => ({
    type: 'people' as const,
    items: response
      .map(mapToSearchResultEntry)
      .filter((value) => !isGarbage(value)),
  }),
  schema: PeopleSearchResultSchema,
  ttl: time.minutes(30),
  retry: 0,
});
