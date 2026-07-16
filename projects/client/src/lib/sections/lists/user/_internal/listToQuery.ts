import { listItemsQuery } from '$lib/requests/queries/lists/listItemsQuery.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import type { ListParams } from '../models/ListParams.ts';
import type { ListToQueryProps } from './ListToQueryProps.ts';

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

export function listToQuery(
  { list, limit, type, page, filter, sortBy, sortHow }: ListToQueryProps,
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
