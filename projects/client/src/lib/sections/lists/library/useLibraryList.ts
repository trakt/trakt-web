import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { libraryEpisodesQuery } from '../../../requests/queries/sync/libraryEpisodesQuery.ts';
import { libraryMoviesQuery } from '../../../requests/queries/sync/libraryMoviesQuery.ts';
import { libraryQuery } from '../../../requests/queries/sync/libraryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '../../../utils/constants.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';
import type { Library } from './models/Library.ts';

type UseLibraryListProps = PaginationParams & {
  library: Library;
  type?: 'movie' | 'episode';
};

function typeToQuery(props: UseLibraryListProps) {
  const params = {
    page: props.page ?? 1,
    limit: props.limit ?? DEFAULT_PAGE_SIZE,
    availableOn: props.library,
  };

  switch (props.type) {
    case 'movie':
      return libraryMoviesQuery(params);
    case 'episode':
      return libraryEpisodesQuery(params);
    default:
      return libraryQuery(params);
  }
}

export function useLibraryList(props: UseLibraryListProps) {
  return usePaginatedListQuery(typeToQuery(props));
}
