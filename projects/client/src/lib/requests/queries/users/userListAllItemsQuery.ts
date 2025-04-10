import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type UserListAllItemsParams =
  & {
    userId: string;
    listId: string;
    type: MediaType;
  }
  & ApiParams;

const ListedShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);

const ListedItemSchema = ListItemSchemaFactory(
  z.union([MovieEntrySchema, ListedShowEntrySchema]),
);

export type ListedItem = z.infer<typeof ListedItemSchema>;

const userListAllItemsRequest = (
  {
    fetch,
    userId,
    listId,
    type,
  }: UserListAllItemsParams,
) =>
  api({ fetch })
    .users
    .lists
    .list
    .items({
      params: {
        id: userId,
        list_id: listId,
        type,
      },
      query: {
        limit: 'all',
      },
    });

export const userListAllItemsQuery = defineQuery({
  key: 'userListAllItems',
  invalidations: [
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
  ],
  dependencies: (
    params,
  ) => [
    params.userId,
    params.listId,
    params.type,
  ],
  request: userListAllItemsRequest,
  mapper: (response) => response.body.map(mapToListItem),
  schema: ListedItemSchema.array(),
  ttl: time.minutes(30),
});
