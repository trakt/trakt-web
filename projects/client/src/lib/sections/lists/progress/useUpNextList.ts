import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
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

const RELEASED_LIST_LIMIT = 500;

export type UpNextStoreProps = PaginationParams & UpNextIntentParams & {
  type: ExtendedMediaType;
};

type ProgressEntry = UpNextEntry | MovieProgressEntry;

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
    case 'episode':
      return upNextNitroQuery(props) as CreateQueryOptions<
        Paginatable<ProgressEntry>
      >;
  }
}

export function useUpNextList(
  props: UpNextStoreProps,
) {
  const { list, page, isLoading } = usePaginatedListQuery(typeToQuery(props));

  return {
    page,
    isLoading,
    list: derived(list, ($list) => {
      const movies = $list as MovieProgressEntry[];
      if (props.type === 'movie') {
        if (props.intent === 'start') {
          return movies.filter((movie) => movie.airDate <= new Date());
        }

        /**
         * FIXME: remove once the DB accurately tracks progress
         */
        return movies
          .filter((movie) => movie.minutesElapsed > 5);
      }

      return $list;
    }),
  };
}
