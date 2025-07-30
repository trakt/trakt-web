import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { upNextNitroQuery } from '$lib/requests/queries/sync/upNextNitroQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';

export type UpNextStoreProps = PaginationParams;

export function useUpNextList(
  props: UpNextStoreProps,
) {
  return usePaginatedListQuery(upNextNitroQuery(props));
}
