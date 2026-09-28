import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchema } from '$lib/requests/models/ListItem.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { typeToListMethod } from '../../_internal/typeToListMethod.ts';

type UserListItemsParams =
  & {
    userId: string;
    listId: string;
    type?: MediaType;
    sortBy?: string | Nil;
    sortHow?: 'asc' | 'desc' | Nil;
    terms?: string | Nil;
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

const userListItemsRequest = (
  {
    fetch,
    userId,
    listId,
    limit,
    page,
    filter,
    type,
    sortBy,
    sortHow,
    terms,
  }: UserListItemsParams,
) => {
  const method = typeToListMethod(type);
  // `terms` is declared by @trakt/api 0.6.1; building the query first keeps it
  // past the inline excess-property check on 0.6.0, which sends it either way.
  const query = {
    extended: 'full,images,colors' as const,
    page,
    limit,
    sort_by: sortBy,
    sort_how: sortHow,
    terms,
    ...filter,
  };

  return api({ fetch })
    .users
    .lists
    .list
    .items[method]({
      params: {
        id: userId,
        list_id: listId,
      },
      query,
    });
};

export const userListItemsQuery = defineInfiniteQuery({
  key: 'userListItems',
  invalidations: [
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: (
    params,
  ) => [
    params.userId,
    params.listId,
    params.limit,
    params.page,
    params.type,
    params.sortBy,
    params.sortHow,
    params.terms,
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: userListItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ListItemSchema),
  ttl: time.minutes(30),
});
