import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { listItemsQuery } from '$lib/requests/queries/lists/listItemsQuery.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import type { SortBy } from './models/SortBy.ts';
import type { SortDirection } from './models/SortDirection.ts';

export type ListParams = {
  slug?: string;
  user?: {
    slug?: string | Nil;
  };
  id?: number;
};

type UseListItemsProps = PaginationParams & FilterParams & {
  list: ListParams;
  type?: DiscoverMode;
  sortBy?: SortBy | Nil;
  sortHow?: SortDirection | Nil;
};

// FIXME: remove when official lists are sluggable
function mapListParamsToQueryParams(list: ListParams) {
  if (list.user?.slug) {
    return {
      userId: list.user.slug,
      listId: assertDefined(list.slug),
    };
  }

  return {
    listId: `${assertDefined(list.id)}`,
  };
}

function listToQuery(
  { list, limit, type, page, filter, sortBy, sortHow }: UseListItemsProps,
) {
  const commonParams = {
    type: type === 'media' ? undefined : type,
    page,
    filter,
    limit: limit ?? DEFAULT_PAGE_SIZE,
    sortBy,
    sortHow,
  };

  const params = mapListParamsToQueryParams(list);
  if (params.userId) {
    return userListItemsQuery({
      ...commonParams,
      userId: params.userId,
      listId: params.listId,
    });
  }

  return listItemsQuery({
    ...commonParams,
    listId: params.listId,
  });
}

export function useListItems(props: UseListItemsProps) {
  return usePaginatedListQuery(listToQuery(props));
}
