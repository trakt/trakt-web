import type { SearchResultResponse } from '$lib/api.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import type { MediaEntry } from '../../models/MediaEntry.ts';

export type SearchParams = {
  query: string;
} & ApiParams;

function isGarbage(value?: MediaEntry): boolean {
  return value?.year == null ||
    !value?.genres.length;
}

function mapToSearchResultEntry(
  item: SearchResultResponse[0],
): MediaEntry {
  const { type } = item;

  const summary = (() => {
    switch (type) {
      case 'show':
        return mapShowResponseToShowSummary(item.show);
      case 'movie':
        return mapMovieResponseToMovieSummary(item.movie);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  })();

  return summary;
}

export const searchCancellationId = () => 'search_cancellation_token';
function searchRequest({
  query,
  fetch,
}: SearchParams): Promise<MediaEntry[]> {
  return api({
    fetch,
    cancellable: true,
    cancellationId: searchCancellationId(),
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
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to search');
      }

      return body
        .map(mapToSearchResultEntry)
        .filter((value) => !isGarbage(value));
    });
}

export const searchQueryKey = (q: string) =>
  ['search', q.toLowerCase().trim()] as const;
export const searchQuery = (params: SearchParams) => ({
  queryKey: searchQueryKey(params.query),
  queryFn: () => searchRequest(params),
  retry: 0,
});
