import { isNarrowedListView } from '$lib/sections/lists/stores/isNarrowedListView.ts';
import type { PaginatedItemCount } from '$lib/sections/lists/stores/PaginatedItemCount.ts';
import { usePaginatedItemCount } from '$lib/sections/lists/stores/usePaginatedItemCount.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { type Observable, of } from 'rxjs';
import { listToQuery } from './_internal/listToQuery.ts';
import type { ListToQueryProps } from './_internal/ListToQueryProps.ts';
import type { ListParams } from './models/ListParams.ts';

type UseListItemCountProps = Omit<ListToQueryProps, 'list'> & {
  list: ListParams | Nil;
};

/*
 * Emits the item count for a list view. Params must mirror the paginated
 * list so both share one query observer instead of firing a second request.
 */
export function useListItemCount(
  { list, ...props }: UseListItemCountProps,
): { itemCount: Observable<PaginatedItemCount | undefined> } {
  if (!list) {
    return { itemCount: of(undefined) };
  }

  const query = usePaginatedListQuery(listToQuery({ list, ...props }));

  return {
    itemCount: usePaginatedItemCount({
      query,
      isNarrowed: isNarrowedListView(props),
    }),
  };
}
