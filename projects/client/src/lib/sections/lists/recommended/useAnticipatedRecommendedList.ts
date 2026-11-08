import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkMediaIntl } from '$lib/features/intl-overlay/createBulkMediaIntl.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { mediaAnticipatedRecommendedQuery } from '$lib/requests/queries/media/mediaAnticipatedRecommendedQuery.ts';
import { anticipatedRecommendedMoviesQuery } from '$lib/requests/queries/recommendations/anticipatedRecommendedMoviesQuery.ts';
import { anticipatedRecommendedShowsQuery } from '$lib/requests/queries/recommendations/anticipatedRecommendedShowsQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import { withListOverlay } from '../stores/withListOverlay.ts';

export type AnticipatedRecommendedEntry = MovieEntry | ShowEntry;

type AnticipatedRecommendedListStoreProps = {
  type: DiscoverMode;
} & PaginationParams &
  FilterParams;

function typeToQuery({
  type,
  ...params
}: AnticipatedRecommendedListStoreProps) {
  switch (type) {
    case 'movie':
      return anticipatedRecommendedMoviesQuery(
        params,
      ) as InfiniteQuery<AnticipatedRecommendedEntry>;
    case 'show':
      return anticipatedRecommendedShowsQuery(
        params,
      ) as InfiniteQuery<AnticipatedRecommendedEntry>;
    case 'media':
      return mediaAnticipatedRecommendedQuery(
        params,
      ) as InfiniteQuery<AnticipatedRecommendedEntry>;
  }
}

export function useAnticipatedRecommendedList(
  props: AnticipatedRecommendedListStoreProps,
) {
  return withListOverlay(
    usePaginatedListQuery(typeToQuery(props)),
    createBulkMediaIntl<AnticipatedRecommendedEntry>(),
  );
}
