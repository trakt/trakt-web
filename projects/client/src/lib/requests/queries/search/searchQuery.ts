import type { SearchResultResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import type { MediaEntry } from '../../models/MediaEntry.ts';

type SearchParams = {
  query: string;
} & ApiParams;

function isGarbage(value?: MediaEntry): boolean {
  return value?.year == null ||
    !value?.genres.length;
}

function mapToSearchResultEntry(item: SearchResultResponse[0]): MediaEntry {
  const { type } = item;
  switch (type) {
    case 'show':
      return mapShowResponseToShowSummary(item.show);
    case 'movie':
      return mapMovieResponseToMovieSummary(item.movie);
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export const searchCancellationId = () => 'search_cancellation_token';

const searchRequest = ({ query, fetch }: SearchParams) =>
  api({
    fetch,
    cancellable: true,
    cancellationId: 'search_cancellation_token',
  })
    .search
    .query({
      query: {
        query,
        extended: 'full,cloud9',
      },
      params: {
        type: 'movie,show',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to search');
      }
      return response.body;
    });

export const searchQuery = await defineQuery({
  key: 'search',
  invalidations: [],
  dependencies: (params) => [params.query.toLowerCase().trim()],
  request: searchRequest,
  mapper: (results) =>
    results
      .map(mapToSearchResultEntry)
      .filter((value) => !isGarbage(value)),
  schema: MediaEntrySchema.array(),
});
