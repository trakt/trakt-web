import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { DEFAULT_SEARCH_LIMIT } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SearchResultResponse } from '@trakt/api';
import type { MediaEntry } from '../../models/MediaEntry.ts';
import type { MediaType } from '../../models/MediaType.ts';

type SearchParams = {
  query: string;
  type: MediaType;
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

export const searchCancellationId = (type: string) =>
  `${type}_search_cancellation_token`;

const EXPERIMENTAL_PARAMS = {
  engine: 'typesense',
};

const searchRequest = ({ query, fetch, type }: SearchParams) =>
  api({
    fetch,
    cancellable: true,
    cancellationId: searchCancellationId(type),
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
        type,
      },
    });

export const searchQuery = defineQuery({
  key: ({ type }) => `search_${type}`,
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
