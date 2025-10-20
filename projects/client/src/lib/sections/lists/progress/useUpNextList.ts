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

export type UpNextStoreProps = PaginationParams & UpNextIntentParams & {
  type: ExtendedMediaType;
};

type ProgressEntry = UpNextEntry | MovieProgressEntry;

function typeToQuery(props: UpNextStoreProps) {
  switch (props.type) {
    case 'movie':
      return movieProgressQuery(props) as CreateQueryOptions<
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
  return usePaginatedListQuery(typeToQuery(props));
}
