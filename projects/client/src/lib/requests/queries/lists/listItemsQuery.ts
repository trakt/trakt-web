import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToListItem } from '$lib/requests/_internal/mapToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type ListItemsParams =
  & {
    listId: string;
    type?: MediaType | 'movie,show';
  }
  & PaginationParams
  & ApiParams;

const ListedShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);

const ListedItemSchema = ListItemSchemaFactory(
  z.union([MovieEntrySchema, ListedShowEntrySchema]),
);

const userListItemsRequest = (
  {
    fetch,
    listId,
    limit,
    page,
    type = 'movie,show',
  }: ListItemsParams,
) =>
  api({ fetch })
    .lists
    .items({
      params: {
        id: listId,
        type,
      },
      query: {
        extended: 'full,images',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch list items');
      }

      return response;
    });

export const listItemsQuery = defineQuery({
  key: 'listItems',
  invalidations: [],
  dependencies: (
    params,
  ) => [
    params.listId,
    params.limit,
    params.page,
    params.type,
  ],
  request: userListItemsRequest,
  mapper: (response) => ({
    entries: response.body.map(mapToListItem),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(ListedItemSchema),
  ttl: time.minutes(30),
});
