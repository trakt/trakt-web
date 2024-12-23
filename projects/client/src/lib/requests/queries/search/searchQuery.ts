import type { Genre, SearchResultResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

export type SearchParams = {
  query: string;
} & ApiParams;

export type SearchResult = {
  type: MediaType;
  id: number;
  slug: string;
  title: string;
  year: number | Nil;
  genres: Genre[];
  runtime: number | Nil;
  poster: {
    url: string;
  };
};

function mapToSearchResultEntry(
  item: SearchResultResponse[0],
): SearchResult {
  const { type } = item;

  const media = (() => {
    switch (type) {
      case 'show':
        return item.show;
      case 'movie':
        return item.movie;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  })();

  return {
    type,
    id: media.ids.trakt,
    slug: media.ids.slug,
    title: media.title,
    year: media.year,
    genres: media.genres ?? [],
    runtime: media.runtime,
    poster: {
      url: prependHttps(
        media.images?.poster.at(1) ??
          media.images?.poster.at(0),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
  };
}

function searchRequest({
  query,
  fetch,
}: SearchParams): Promise<SearchResult[]> {
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
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to search');
      }

      return body
        .map(mapToSearchResultEntry);
    });
}

export const searchQueryKey = (q: string) =>
  ['search', q.toLowerCase().trim()] as const;
export const searchCancellationId = () => `search_cancellation_token`;
export const searchQuery = (params: SearchParams) => ({
  queryKey: searchQueryKey(params.query),
  queryFn: () => searchRequest(params),
  retry: 0,
});
