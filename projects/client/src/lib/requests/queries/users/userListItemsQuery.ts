import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { getGlobalFilterDependencies } from '../../_internal/getGlobalFilterDependencies.ts';
import { typeToListMethod } from '../../_internal/typeToListMethod.ts';

type UserListItemsParams =
  & {
    userId: string;
    listId: string;
    type?: MediaType;
    sortBy?: string | Nil;
    sortHow?: 'asc' | 'desc' | Nil;
  }
  & PaginationParams
  & ApiParams
  & FilterParams;

const ListedItemSchema = ListItemSchemaFactory(
  z.union([MovieEntrySchema, ShowEntrySchema]),
);

export type ListedItem = z.infer<typeof ListedItemSchema>;

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
  }: UserListItemsParams,
) => {
  const method = typeToListMethod(type);

  return api({ fetch })
    .users
    .lists
    .list
    .items[method]({
      params: {
        id: userId,
        list_id: listId,
      },
      query: {
        extended: 'full,images,colors',
        page,
        limit,
        sort_by: sortBy,
        sort_how: sortHow,
        ...filter,
      },
    });
};

export const userListItemsQuery = defineQuery({
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
    ...getGlobalFilterDependencies(params.filter),
  ],
  request: userListItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ListedItemSchema),
  ttl: time.minutes(30),
});
