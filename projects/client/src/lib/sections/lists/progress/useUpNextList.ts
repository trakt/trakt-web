import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { episodeWithShowOrMovieTargets } from '$lib/features/intl-overlay/episodeWithShowOrMovieTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MovieProgressEntry } from '$lib/requests/models/MovieProgressEntry.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import {
  mediaProgressQuery,
} from '$lib/requests/queries/sync/mediaProgressQuery.ts';
import {
  movieProgressQuery,
} from '$lib/requests/queries/sync/movieProgressQuery.ts';
import {
  upNextNitroQuery,
} from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';

export type UpNextStoreProps =
  & PaginationParams
  & FilterParams
  & {
    type: DiscoverMode;
    sortBy?: UpNextSortBy;
    sortHow?: SortDirection;
  };

type ProgressEntry = UpNextEntry | MovieProgressEntry;

function typeToQuery(props: UpNextStoreProps) {
  switch (props.type) {
    case 'movie':
      return movieProgressQuery(props) as InfiniteQuery<
        ProgressEntry
      >;
    case 'show':
      return upNextNitroQuery(props) as InfiniteQuery<ProgressEntry>;
    default:
      return mediaProgressQuery(props) as InfiniteQuery<
        ProgressEntry
      >;
  }
}

export function useUpNextList(
  props: UpNextStoreProps,
) {
  const { list: baseList, isLoading: baseLoading, ...rest } =
    usePaginatedListQuery(typeToQuery(props));
  const overlay = createBulkIntlOverlay<ProgressEntry>({
    getTargets: episodeWithShowOrMovieTargets,
  });
  return {
    list: baseList.pipe(overlay.operator),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}
