import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MovieProgressEntry } from '$lib/requests/models/MovieProgressEntry.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import {
  type MediaProgressIntent,
  mediaProgressQuery,
} from '$lib/requests/queries/sync/mediaProgressQuery.ts';
import {
  movieProgressQuery,
} from '$lib/requests/queries/sync/movieProgressQuery.ts';
import {
  upNextNitroQuery,
} from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { combineLatest, map } from 'rxjs';

export type UpNextStoreProps =
  & PaginationParams
  & FilterParams
  & {
    type: DiscoverMode;
    intent: MediaProgressIntent;
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
  if (props.type === 'show' || props.intent === 'continue') {
    return usePaginatedListQuery(typeToQuery(props));
  }

  /*
    In case of `start watching`, we also fetch the `continue` list
    to filter out movies that are already in progress.
  */
  const startQuery = usePaginatedListQuery(typeToQuery(props));
  const continueQuery = usePaginatedListQuery(typeToQuery({
    ...props,
    intent: 'continue',
  }));

  const filteredList = combineLatest(
    [startQuery.list, continueQuery.list],
  ).pipe(
    map(
      ([$startList, $continueList]) => {
        const continueMovieIds = new Set(
          $continueList.map((entry) => entry.key),
        );
        return $startList.filter((entry) =>
          'show' in entry || !continueMovieIds.has(entry.key)
        );
      },
    ),
  );

  return {
    ...startQuery,
    list: filteredList,
    isLoading: combineLatest(
      [startQuery.isLoading, continueQuery.isLoading],
    ).pipe(
      map(
        ([$startLoading, $continueLoading]) =>
          $startLoading || $continueLoading,
      ),
    ),
  };
}
