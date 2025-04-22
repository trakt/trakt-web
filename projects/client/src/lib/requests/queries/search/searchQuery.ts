import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { DEFAULT_SEARCH_LIMIT } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SearchResultResponse } from '@trakt/api';
import type { MediaEntry } from '../../models/MediaEntry.ts';

type SearchParams = {
  query: string;
} & ApiParams;

function isGarbage(value?: MediaEntry): boolean {
  const isReleased = value?.status === 'released';
  const isInvalidRelease = isReleased && value?.year == null;
  const hasNoGenres = !value?.genres.length;

  return isInvalidRelease ||
    hasNoGenres;
}

function mapToSearchResultEntry(item: SearchResultResponse[0]): MediaEntry {
  const { type } = item;
  switch (type) {
    case 'show':
      return mapToShowEntry(item.show);
    case 'movie':
      return mapToMovieEntry(item.movie);
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export const searchCancellationId = () => 'search_cancellation_token';

const searchRequest = ({ query, fetch }: SearchParams) =>
  api({
    fetch,
    cancellable: true,
    cancellationId: searchCancellationId(),
  })
    .search
    .query({
      query: {
        query,
        extended: 'full,images',
        limit: DEFAULT_SEARCH_LIMIT,
      },
      params: {
        type: 'movie,show',
      },
    });

export const searchQuery = defineQuery({
  key: 'search',
  invalidations: [],
  dependencies: (params) => [params.query.toLowerCase().trim()],
  request: searchRequest,
  mapper: (response) =>
    response.body
      .map(mapToSearchResultEntry)
      .filter((value) => !isGarbage(value)),
  schema: MediaEntrySchema.array(),
  ttl: time.minutes(30),
  retry: 0,
});
