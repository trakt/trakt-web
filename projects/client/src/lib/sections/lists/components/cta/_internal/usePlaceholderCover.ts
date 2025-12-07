import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
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
import { shuffle } from '$lib/utils/array/shuffle.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import type { ListCta, MediaCta } from '../models/Cta.ts';

type PreviewItem =
  | TrendingShow
  | TrendingMovie
  | AnticipatedShow
  | AnticipatedMovie;

type PaginatablePreviewItem = Paginatable<PreviewItem>;

function mediaTypeToQuery(type: MediaType, isFuture?: boolean) {
  const params = {
    limit: 10,
  };

  if (isFuture) {
    switch (type) {
      case 'movie':
        return movieAnticipatedQuery(params) as CreateQueryOptions<
          PaginatablePreviewItem
        >;
      case 'show':
        return showAnticipatedQuery(params) as CreateQueryOptions<
          PaginatablePreviewItem
        >;
    }
  }

  switch (type) {
    case 'movie':
      return movieTrendingQuery(params) as CreateQueryOptions<
        PaginatablePreviewItem
      >;
    case 'show':
      return showTrendingQuery(params) as CreateQueryOptions<
        PaginatablePreviewItem
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
  const query = useQuery(ctaToQuery(cta));

  const items = derived(
    query,
    ($query) => {
      if (!$query.data || $query.data.entries.length === 0) {
        return null;
      }

      return $query.data.entries;
    },
  );

  return {
    cover: derived(
      items,
      ($items) => {
        if (!$items) {
          return null;
        }

        return shuffle($items).at(0)?.cover;
      },
    ),
  };
}
