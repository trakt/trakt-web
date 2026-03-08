import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { Library } from './models/Library.ts';

type UseLibraryListProps = PaginationParams & {
  library: Library;
  type?: DiscoverMode;
};

export function useLibraryList(props: UseLibraryListProps) {
  return usePaginatedListQuery(libraryQuery({
    page: props.page ?? 1,
    limit: props.limit ?? DEFAULT_PAGE_SIZE,
    availableOn: props.library,
    type: props.type,
  }));
}
