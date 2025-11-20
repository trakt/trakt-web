import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { UpNextIntentParams } from '$lib/requests/models/UpNextIntentParams.ts';
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
import { mediaProgressQuery } from '../../../requests/queries/sync/mediaProgressQuery.ts';

const RELEASED_LIST_LIMIT = 500;

export type UpNextStoreProps = PaginationParams & UpNextIntentParams & {
  type: DiscoverMode;
};

export type ProgressEntry = UpNextEntry | MovieProgressEntry;

function typeToQuery(props: UpNextStoreProps) {
  switch (props.type) {
    case 'movie':
      return movieProgressQuery({
        ...props,
        limit: props.intent === 'start' ? RELEASED_LIST_LIMIT : props.limit,
      }) as CreateQueryOptions<
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
  const isStartWatchingMovie = props.type === 'movie' &&
    props.intent === 'start';

  if (!isStartWatchingMovie) {
    return usePaginatedListQuery(typeToQuery(props));
  }

  /*
    In case of a `start watching` movies, we also fetch the `continue` list
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
      const continueMovieIds = new Set($continueList.map((entry) => entry.id));
      return $startList.filter((entry) => !continueMovieIds.has(entry.id));
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
