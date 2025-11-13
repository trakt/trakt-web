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
  return usePaginatedListQuery(typeToQuery(props));
}
