import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapListedShowResponseToListItem } from '$lib/requests/_internal/mapListItemResponseToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type ListShowItemsParams =
  & {
    id: number;
    page?: number;
    limit?: number;
  }
  & ApiParams;

const ListedShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);
export const ListedShowSchema = ListItemSchemaFactory(ListedShowEntrySchema);
export type ListedShow = z.infer<typeof ListedShowSchema>;

const listShowItemsRequest = (
  { fetch, id, limit = DEFAULT_PAGE_SIZE, page = 1 }: ListShowItemsParams,
) =>
  api({ fetch })
    .lists
    .items
    .shows({
      params: {
        id: `${id}`,
      },
      query: {
        extended: 'full,images',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch list show items');
      }

      return response.body;
    });

export const listShowItemsQuery = defineQuery({
  key: 'listShowItems',
  invalidations: [],
  dependencies: (params) => [params.id, params.limit, params.page],
  request: listShowItemsRequest,
  mapper: (data) => data.map(mapListedShowResponseToListItem),
  schema: ListedShowSchema.array(),
  ttl: time.minutes(30),
});
