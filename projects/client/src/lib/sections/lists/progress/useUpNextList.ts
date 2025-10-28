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
import { weave } from '$lib/utils/array/weave.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const RELEASED_LIST_LIMIT = 500;

export type UpNextStoreProps = PaginationParams & UpNextIntentParams & {
  type: DiscoverMode;
};

export type ProgressEntry = UpNextEntry | MovieProgressEntry;

function typeToQueries(props: UpNextStoreProps) {
  switch (props.type) {
    case 'movie':
      return [movieProgressQuery({
        ...props,
        limit: props.intent === 'start' ? RELEASED_LIST_LIMIT : props.limit,
      }) as CreateQueryOptions<
        Paginatable<ProgressEntry>
      >];
    case 'show':
      return [upNextNitroQuery(props) as CreateQueryOptions<
        Paginatable<ProgressEntry>
      >];
    default:
      return [
        upNextNitroQuery(props) as CreateQueryOptions<
          Paginatable<ProgressEntry>
        >,
        movieProgressQuery({
          ...props,
          limit: props.intent === 'start' ? RELEASED_LIST_LIMIT : props.limit,
        }) as CreateQueryOptions<
          Paginatable<ProgressEntry>
        >,
      ];
  }
}

export function useUpNextList(
  props: UpNextStoreProps,
) {
  const queries = typeToQueries(props)
    .map((query) => usePaginatedListQuery(query));

  const isLoading = derived(
    queries.map((q) => q.isLoading),
    ($loadingStates) => $loadingStates.some((loading) => loading),
  );

  const page = derived(
    queries.map((q) => q.page),
    ($pages) => $pages[0],
  );

  const list = derived(
    queries.map((q) => q.list),
    ($lists) => {
      const filteredLists = $lists.map((list) =>
        list.filter((item) => {
          if (props.intent === 'start') {
            return item.type !== 'movie' || item.airDate <= new Date();
          }

          if (props.intent === 'continue' && item.type === 'movie') {
            /**
             * FIXME: remove once the DB accurately tracks progress
             */
            return item.minutesElapsed > 5;
          }

          return true;
        })
      );

      return filteredLists.length === 1
        ? assertDefined(filteredLists.at(0))
        : weave(...filteredLists);
    },
  );

  return {
    list,
    page,
    isLoading,
  };
}
