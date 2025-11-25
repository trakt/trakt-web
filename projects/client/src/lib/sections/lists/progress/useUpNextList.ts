import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import {
  type MediaProgressIntent,
  mediaProgressQuery,
} from '$lib/requests/queries/sync/mediaProgressQuery.ts';
import {
  type MovieProgressEntry,
  movieProgressQuery,
} from '$lib/requests/queries/sync/movieProgressQuery.ts';
import {
  type UpNextEntry,
  upNextNitroQuery,
} from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type UpNextStoreProps = PaginationParams & {
  type: DiscoverMode;
  intent: MediaProgressIntent;
};

export type ProgressEntry = UpNextEntry | MovieProgressEntry;

function typeToQuery(props: UpNextStoreProps) {
  switch (props.type) {
    case 'movie':
      return movieProgressQuery(props) as CreateQueryOptions<
        Paginatable<ProgressEntry>
      >;
    case 'show':
      return upNextNitroQuery(props) as CreateQueryOptions<
        Paginatable<ProgressEntry>
      >;
    default:
      return mediaProgressQuery(props) as CreateQueryOptions<
        Paginatable<ProgressEntry>
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

  const filteredList = derived(
    [startQuery.list, continueQuery.list],
    ([$startList, $continueList]) => {
      const continueMovieIds = new Set($continueList.map((entry) => entry.key));
      return $startList.filter((entry) =>
        'show' in entry || !continueMovieIds.has(entry.key)
      );
    },
  );

  return {
    ...startQuery,
    list: filteredList,
    isLoading: derived(
      [startQuery.isLoading, continueQuery.isLoading],
      ([$startLoading, $continueLoading]) => $startLoading || $continueLoading,
    ),
  };
}
