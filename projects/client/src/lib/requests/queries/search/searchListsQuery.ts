import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SearchResultResponse } from '@trakt/api';
import z from 'zod';
import { mapToMediaListSummary } from '../../_internal/mapToMediaListSummary.ts';
import { MediaListSummarySchema } from '../../models/MediaListSummary.ts';

type SearchParams = {
  query?: string;
  limit: number;
} & ApiParams;

const ListsSearchResultSchema = z.object({
  type: z.literal('lists'),
  items: MediaListSummarySchema.array(),
});

export type ListsSearchResult = z.infer<typeof ListsSearchResultSchema>;

function mapToSearchResultEntry(
  item: SearchResultResponse,
) {
  const { type } = item;
  switch (type) {
    case 'list':
      return {
        score: item.score,
        ...mapToMediaListSummary(assertDefined(item.list)),
      };
    default:
      throw new Error(`Unsupported type for lists search: ${type}`);
  }
}

const searchRequest = ({ query, limit }: SearchParams) => {
  return api({
    fetch,
    cancellable: true,
  })
    .search
    .query({
      query: {
        query,
        limit,
        extended: 'full,images',
      },
      params: {
        type: 'list',
      },
    });
};

export const searchListsQuery = defineQuery({
  key: 'searchLists',
  invalidations: [],
  dependencies: (params) => [params.query, params.limit],
  request: searchRequest,
  mapper: (response) => ({
    type: 'lists' as const,
    items: response
      .body
      .map(mapToSearchResultEntry),
  }),
  schema: ListsSearchResultSchema,
  ttl: time.minutes(30),
  retry: 0,
});
