import { useQuery } from '$lib/features/query/useQuery.ts';
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
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import type { MediaCta } from '../models/Cta.ts';

type PreviewItem =
  | TrendingShow
  | TrendingMovie
  | AnticipatedShow
  | AnticipatedMovie;

type PaginatablePreviewItem = Paginatable<PreviewItem>;

function ctaToQuery(cta: MediaCta) {
  const params = {
    page: 1,
    limit: 1,
  };

  switch (cta.type) {
    case 'up-next':
    case 'personal-activity':
      return showTrendingQuery(params) as CreateQueryOptions<
        PaginatablePreviewItem
      >;
    case 'watchlist':
    case 'favorites':
    case 'released':
      return movieTrendingQuery(params) as CreateQueryOptions<
        PaginatablePreviewItem
      >;
    case 'upcoming':
      return showAnticipatedQuery(params) as CreateQueryOptions<
        PaginatablePreviewItem
      >;
    case 'unreleased':
      return movieAnticipatedQuery(params) as CreateQueryOptions<
        PaginatablePreviewItem
      >;
  }
}

export function usePlaceholderCover(
  cta: MediaCta,
) {
  const query = useQuery(ctaToQuery(cta));

  return {
    cover: derived(
      query,
      ($query) => {
        if (!$query.data || $query.data.entries.length === 0) {
          return null;
        }

        return $query.data.entries.at(0)?.cover;
      },
    ),
  };
}
