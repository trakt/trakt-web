import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  type AnticipatedMovie,
  movieAnticipatedQuery,
} from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import {
  movieTrendingQuery,
  type TrendingMovie,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  type AnticipatedShow,
  showAnticipatedQuery,
} from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import {
  showTrendingQuery,
  type TrendingShow,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { map } from 'rxjs';
import type { ListCta, MediaCta } from '../models/Cta.ts';

type PreviewItem =
  | TrendingShow
  | TrendingMovie
  | AnticipatedShow
  | AnticipatedMovie;

function mediaTypeToQuery(type: MediaType, isFuture?: boolean) {
  const params = {
    limit: 10,
  };

  if (isFuture) {
    switch (type) {
      case 'movie':
        return movieAnticipatedQuery(params) as InfiniteQuery<
          PreviewItem
        >;
      case 'show':
        return showAnticipatedQuery(params) as InfiniteQuery<
          PreviewItem
        >;
    }
  }

  switch (type) {
    case 'movie':
      return movieTrendingQuery(params) as InfiniteQuery<
        PreviewItem
      >;
    case 'show':
      return showTrendingQuery(params) as InfiniteQuery<
        PreviewItem
      >;
  }
}

function ctaToQuery(cta: MediaCta | ListCta) {
  switch (cta.type) {
    case 'released':
      return mediaTypeToQuery('movie');
    case 'up-next':
    case 'start-watching':
    case 'personal-activity':
    case 'watchlist':
    case 'favorites':
    case 'personal-list':
    case 'upcoming':
      return mediaTypeToQuery(cta.mediaType ?? 'show', cta.type === 'upcoming');
  }
}

export function usePlaceholderCover(
  cta: MediaCta | ListCta,
) {
  const { list } = usePaginatedListQuery(ctaToQuery(cta));

  return {
    cover: list.pipe(map(($list) => shuffle($list).at(0)?.cover)),
  };
}
